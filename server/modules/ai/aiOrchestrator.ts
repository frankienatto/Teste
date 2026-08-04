import { GoogleGenAI } from "@google/genai";
import { agentRouter } from "./agentRouter.ts";
import { contextService } from "./contextService.ts";
import { sessionMemory } from "./sessionMemory.ts";
import { compileSystemInstruction } from "../../ai/promptRegistry.ts";
import { 
  OperationalContext, 
  AgentSelectionResult 
} from "./aiTypes.ts";

export interface AiOrchestratorParams {
  prompt: string;
  agentId?: string;
  sessionId?: string;
  organizationId?: string;
  propertyId?: string;
  userId?: string;
  schema?: any;
  systemInstruction?: string;
  context?: Record<string, any>;
  modelName?: string;
}

export interface AiOrchestratorResult {
  text: string;
  data?: any;
  agentId: string;
  agentSelection: AgentSelectionResult;
  operationalContext: OperationalContext;
  sessionId: string;
  source: string;
}

const sleepServer = (ms: number) => new Promise(res => setTimeout(res, ms));

async function withRetryServer<T>(fn: () => Promise<T>, retries = 3): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;
      const errorMsg = String(error?.message || error || "");
      if (errorMsg.includes('429') || errorMsg.includes('RESOURCE_EXHAUSTED') || errorMsg.includes('UNAVAILABLE')) {
        const backoffMs = Math.pow(2, i) * 1000 + Math.floor(Math.random() * 500);
        console.warn(`⚠️ [Gemini RateLimit] Tentativa ${i + 1}/${retries} aguardando ${backoffMs}ms...`);
        await sleepServer(backoffMs);
        continue;
      }
      throw error;
    }
  }
  throw lastError;
}

export class AiOrchestrator {
  /**
   * Ponto central de orquestração do pipeline de IA.
   * Fluxo:
   * 1. AgentSelector -> Seleção determinística do Agente
   * 2. ContextService -> Construção do OperationalContext desacoplado
   * 3. SessionMemory -> Armazenamento da mensagem do Usuário
   * 4. PromptRegistry -> Compilação da SystemInstruction com OperationalContext
   * 5. @google/genai SDK -> Chamada com retry automático
   * 6. SessionMemory -> Armazenamento da resposta do Assistente
   */
  async execute(params: AiOrchestratorParams): Promise<AiOrchestratorResult> {
    const {
      prompt,
      agentId: requestedAgentId,
      sessionId: rawSessionId,
      organizationId = 'org_dev_default',
      propertyId = 'prop_dev_default',
      userId,
      schema,
      systemInstruction,
      context,
      modelName = "gemini-3.6-flash"
    } = params;

    const sessionId = rawSessionId || `session_${organizationId}_${propertyId}`;

    // 1. AgentRouter: Roteamento determinístico de Agente
    const agentSelection = agentRouter.route(prompt, requestedAgentId);

    // 2. ContextService: Construção do OperationalContext puro
    const operationalContext = await contextService.buildOperationalContext(
      organizationId,
      propertyId,
      userId,
      sessionId
    );

    // 3. Registrar mensagem do Usuário na SessionMemory
    await sessionMemory.addMessage(
      sessionId,
      { role: 'user', content: prompt },
      { organizationId, propertyId, agentId: agentSelection.agentId }
    );

    // 4. PromptRegistry: Compilação da instrução de sistema
    const compiledInstruction = compileSystemInstruction(
      agentSelection.agentId,
      systemInstruction,
      context,
      operationalContext
    );

    // 5. Preparar o prompt final incluindo histórico recente se existente
    let fullPromptContents = prompt;
    if (operationalContext.sessionHistory && operationalContext.sessionHistory.length > 1) {
      // Exclui a mensagem atual recém adicionada para formatar o histórico anterior
      const previousHistory = operationalContext.sessionHistory.slice(0, -1);
      if (previousHistory.length > 0) {
        const historyStr = previousHistory
          .map(m => `[${m.role.toUpperCase()}]: ${m.content}`)
          .join('\n');
        fullPromptContents = `HISTÓRICO DA CONVERSA:\n${historyStr}\n\nMENSAGEM ATUAL DO USUÁRIO:\n${prompt}`;
      }
    }

    // 6. Execução do modelo Gemini
    let responseText = "";
    let parsedData: any = null;
    let source = modelName;

    if (!process.env.GEMINI_API_KEY) {
      console.warn("⚠️ [AiOrchestrator] Servidor sem GEMINI_API_KEY. Gerando resposta mock de fallback.");
      responseText = `[Resposta Synapse IA - Agente: ${agentSelection.agentId}] Processado com sucesso para o tenant '${operationalContext.organization?.name || organizationId}'. Solicitação: "${prompt}"`;
      source = "fallback_mock";
    } else {
      try {
        const ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'synapse-ahos-server' } }
        });

        const result = await withRetryServer(async () => {
          return await ai.models.generateContent({
            model: modelName,
            contents: fullPromptContents,
            config: {
              systemInstruction: compiledInstruction,
              ...(schema ? { responseMimeType: "application/json", responseSchema: schema } : {})
            }
          });
        });

        responseText = result.text || "";
        if (!responseText) {
          throw new Error("Resposta vazia retornada pelo modelo Gemini.");
        }
      } catch (geminiError: any) {
        console.warn("⚠️ [AiOrchestrator] Chamada ao Gemini falhou:", geminiError?.message || geminiError);
        source = "fallback_mock";
        responseText = `[Resposta Synapse IA - Agente: ${agentSelection.agentId}] Processado com sucesso para o tenant '${operationalContext.organization?.name || organizationId}'. Solicitação: "${prompt}"`;
      }
    }

    // Tratar schema JSON se exigido
    if (schema || responseText.trim().startsWith('{') || responseText.trim().startsWith('[')) {
      try {
        parsedData = JSON.parse(responseText.trim());
      } catch (e) {
        parsedData = responseText;
      }
    } else {
      parsedData = responseText;
    }

    // 7. Registrar resposta do Assistente na SessionMemory
    await sessionMemory.addMessage(
      sessionId,
      { role: 'assistant', content: responseText },
      { organizationId, propertyId, agentId: agentSelection.agentId }
    );

    return {
      text: responseText,
      data: parsedData,
      agentId: agentSelection.agentId,
      agentSelection,
      operationalContext,
      sessionId,
      source
    };
  }
}

export const aiOrchestrator = new AiOrchestrator();
