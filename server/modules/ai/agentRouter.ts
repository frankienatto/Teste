import { AgentSelectionResult } from './aiTypes.ts';

export interface RouteRule {
  agentId: string;
  domain: string;
  keywords: string[];
}

export class AgentRouter {
  private rules: RouteRule[] = [
    {
      agentId: 'revenue_agent',
      domain: 'Revenue Intelligence & Performance Comercial',
      keywords: ['revenue', 'adr', 'revpar', 'ocupação', 'ocupacao', 'forecast', 'diária média', 'diaria media', 'receita por quarto', 'performance comercial', 'booking pace', 'pace', 'pickup', 'tarifa média', 'tarifa media', 'lead time']
    },
    {
      agentId: 'reception_agent',
      domain: 'Recepção & Reservas',
      keywords: ['reserva', 'booking', 'checkin', 'check-in', 'checkout', 'check-out', 'hospede', 'hóspede', 'recepcao', 'recepção', 'tarifario', 'tarifário', 'quarto', 'apartamento', 'overbooking', 'no-show', 'noshow']
    },
    {
      agentId: 'financial_agent',
      domain: 'Financeiro & DRE',
      keywords: ['financeiro', 'fatura', 'pagamento', 'receita', 'dre', 'caixa', 'saldo', 'fluxo de caixa', 'despesa', 'faturamento', 'cartao', 'pix', 'inadimplencia', 'contas a pagar', 'contas a receber']
    },
    {
      agentId: 'housekeeping_agent',
      domain: 'Governança & Manutenção',
      keywords: ['manutencao', 'manutenção', 'limpeza', 'governanca', 'governança', 'camareira', 'toalha', 'enxoval', 'reparo', 'vazamento', 'ar condicionado', 'frigobar', 'vistoria', 'sujo', 'suja', 'sujos', 'sujas', 'higienização', 'higienizacao', 'arrumação', 'arrumacao', 'faxina', 'out_of_service', 'dirty', 'clean']
    },
    {
      agentId: 'marketing_agent',
      domain: 'Marketing & Vendas',
      keywords: ['marketing', 'vendas', 'campanha', 'promocao', 'promoção', 'redes sociais', 'instagram', 'cupom', 'mkt', 'fidelidade', 'conversion', 'tarifaria']
    },
    {
      agentId: 'concierge_agent',
      domain: 'Concierge & Experiência do Hóspede',
      keywords: ['concierge', 'experiências', 'experiencias', 'restaurantes', 'restaurante', 'passeios', 'passeio', 'aniversário', 'aniversario', 'lua de mel', 'transporte', 'transfer', 'turismo']
    }
  ];

  /**
   * Executa o roteamento determinístico da mensagem para o agente especializado.
   * 
   * Diretrizes estritas:
   * 1. 100% determinístico e sem uso de LLM / classificadores estocásticos.
   * 2. Se agentId for passado explicitamente, ele é respeitado com confiança HIGH.
   * 3. Pontuação baseada na contagem exata de termos correspondentes.
   * 4. Retorna justificativa detalhada com a lista de palavras-chave encontradas.
   */
  route(prompt: string, requestedAgentId?: string): AgentSelectionResult {
    // 1. Regra de Agente Explícito
    if (requestedAgentId && requestedAgentId.trim() !== '') {
      return {
        agentId: requestedAgentId.trim(),
        reason: `Agente selecionado explicitamente na requisição: ${requestedAgentId}`,
        confidence: 'HIGH',
        matchedKeywords: []
      };
    }

    const normalizedPrompt = (prompt || '').toLowerCase();
    let bestMatch: { rule: RouteRule; matchedKeywords: string[]; score: number } | null = null;

    // 2. Avaliação de regras por busca de palavras-chave
    for (const rule of this.rules) {
      const matched = rule.keywords.filter(kw => normalizedPrompt.includes(kw));
      if (matched.length > 0) {
        if (!bestMatch || matched.length > bestMatch.score) {
          bestMatch = {
            rule,
            matchedKeywords: matched,
            score: matched.length
          };
        }
      }
    }

    // 3. Resultado baseado na melhor pontuação
    if (bestMatch) {
      const confidence: 'HIGH' | 'MEDIUM' = bestMatch.score >= 2 ? 'HIGH' : 'MEDIUM';
      return {
        agentId: bestMatch.rule.agentId,
        reason: `Palavras-chave de ${bestMatch.rule.domain} identificadas (${bestMatch.matchedKeywords.join(', ')})`,
        confidence,
        matchedKeywords: bestMatch.matchedKeywords
      };
    }

    // 4. Fallback padrão Synapse Copilot
    return {
      agentId: 'synapse_copilot',
      reason: 'Nenhuma palavra-chave específica encontrada. Direcionado para o Synapse Copilot padrão.',
      confidence: 'FALLBACK',
      matchedKeywords: []
    };
  }
}

export const agentRouter = new AgentRouter();
