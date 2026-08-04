export interface PromptDefinition {
  agentId: string;
  name: string;
  version: string;
  systemInstruction: string;
  description: string;
  updatedAt: string;
}

const DEFAULT_PROMPTS: Record<string, PromptDefinition> = {
  guest_concierge: {
    agentId: 'guest_concierge',
    name: 'Concierge Virtual 24/7',
    version: '1.0.0',
    description: 'Atendimento inteligente a hóspedes, tirando dúvidas sobre a propriedade e serviços.',
    systemInstruction: `Você é o Concierge Virtual 24/7 do hotel {{hotelName}}.
Sua missão é atender o hóspede {{guestName}} com cortesia, elegância e eficiência em português (Brasil).
Informações do Hotel:
- Horário de Check-in: {{checkInTime}}
- Horário de Check-out: {{checkOutTime}}
- Regras e Serviços: {{hotelPolicies}}
Responda de forma clara, prestativa e profissional.`,
    updatedAt: new Date().toISOString(),
  },
  synapse_orchestrator: {
    agentId: 'synapse_orchestrator',
    name: 'Synapse Master Orchestrator',
    version: '1.0.0',
    description: 'Orquestrador central de inteligência operacional para a equipe hoteleira.',
    systemInstruction: `Você é o Synapse Master Orchestrator, o cérebro operacional da plataforma Synapse AHOS no hotel {{hotelName}}.
Você auxilia gerentes, recepcionistas e operadores a analisarem dados, gerenciarem tarefas e tomarem decisões operacionais estratégicas.
Responda sempre com tom profissional, focado em resultados, em português (Brasil).`,
    updatedAt: new Date().toISOString(),
  },
  dynamic_pricing: {
    agentId: 'dynamic_pricing',
    name: 'Especialista em Precificação Dinâmica',
    version: '1.0.0',
    description: 'Análise de demanda e cálculo de tarifas otimizadas.',
    systemInstruction: `Você é o especialista de Revenue Management e Precificação Dinâmica do hotel {{hotelName}}.
Analise a ocupação atual ({{occupancyRate}}%), a sazonalidade e a concorrência para recomendar ajustes de diárias e otimizar o RevPAR.
Responda em português (Brasil) de forma objetiva e analítica.`,
    updatedAt: new Date().toISOString(),
  },
  financial_consultant: {
    agentId: 'financial_consultant',
    name: 'Consultor Financeiro & DRE',
    version: '1.0.0',
    description: 'Análise de custos, ponto de equilíbrio e fluxo de caixa.',
    systemInstruction: `Você é o consultor financeiro especialista em hospitalidade do hotel {{hotelName}}.
Analise relatórios financeiros, cálculo de breakeven, margem de lucro e DRE com rigor e clareza.
Responda em português (Brasil) com sugestões práticas e pautadas em números.`,
    updatedAt: new Date().toISOString(),
  },
  marketing_generator: {
    agentId: 'marketing_generator',
    name: 'Gerador de Marketing & Growth',
    version: '1.0.0',
    description: 'Criação de cópias de anúncios, mensagens promocionais e posts.',
    systemInstruction: `Você é o especialista de Marketing e Growth da plataforma Synapse para o hotel {{hotelName}}.
Crie campanhas publicitárias, e-mails promocionais e textos para redes sociais direcionados ao público-alvo {{targetAudience}}.
Responda em português (Brasil) com linguagem persuasiva e engajadora.`,
    updatedAt: new Date().toISOString(),
  },
  default_agent: {
    agentId: 'default_agent',
    name: 'Agente Executivo Synapse',
    version: '1.0.0',
    description: 'Agente padrão para tarefas gerais da plataforma.',
    systemInstruction: `Você é o Agente Executivo da plataforma hoteleira Synapse AHOS no hotel {{hotelName}}.
Responda com precisão técnica e pragmatismo em português (Brasil).`,
    updatedAt: new Date().toISOString(),
  }
};

// In-memory store for prompt definitions (Server-side Prompt Registry)
const promptStore: Record<string, PromptDefinition> = { ...DEFAULT_PROMPTS };

/**
 * Interpolação simples de variáveis no formato {{nomeVariavel}}.
 * Sem utilização de bibliotecas externas (sem Mustache) para manter simplicidade estrita.
 */
export function interpolatePrompt(template: string, variables: Record<string, any> = {}): string {
  if (!template) return '';
  return template.replace(/\{\{\s*(\w+)\s*\}\}/g, (_, key) => {
    const val = variables[key];
    return val !== undefined && val !== null ? String(val) : '';
  });
}

/**
 * Obtém a definição de prompt para um dado agentId.
 * Se não for encontrado, retorna a definição do default_agent.
 */
export function getPrompt(agentId: string): PromptDefinition {
  return promptStore[agentId] || promptStore['default_agent'] || DEFAULT_PROMPTS['default_agent'];
}

/**
 * Retorna todos os prompts cadastrados no Prompt Registry.
 */
export function getAllPrompts(): PromptDefinition[] {
  return Object.values(promptStore);
}

/**
 * Compila a instrução de sistema final para um agente aplicando as variáveis de contexto enviadas.
 */
export function compileSystemInstruction(agentId?: string, customInstruction?: string, context?: Record<string, any>): string {
  const definition = getPrompt(agentId || 'default_agent');
  const rawInstruction = customInstruction || definition.systemInstruction;
  
  const defaultVars = {
    hotelName: 'Forest House Beach',
    checkInTime: '14:00',
    checkOutTime: '12:00',
    hotelPolicies: 'Proibido fumar nos quartos. Horário de silêncio após as 22h.',
    ...(context || {})
  };

  return interpolatePrompt(rawInstruction, defaultVars);
}

/**
 * Atualiza ou cria uma definição de prompt no Prompt Registry.
 */
export function updatePrompt(agentId: string, systemInstruction: string, name?: string, description?: string): PromptDefinition {
  const existing = getPrompt(agentId);
  const currentVersionParts = existing.version.split('.').map(Number);
  const newPatch = (currentVersionParts[2] || 0) + 1;
  const newVersion = `${currentVersionParts[0] || 1}.${currentVersionParts[1] || 0}.${newPatch}`;

  const updated: PromptDefinition = {
    agentId,
    name: name || existing.name,
    version: newVersion,
    description: description || existing.description,
    systemInstruction,
    updatedAt: new Date().toISOString()
  };

  promptStore[agentId] = updated;
  return updated;
}
