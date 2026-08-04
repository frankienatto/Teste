import { decisionRepository } from './decisionRepository.ts';
import { 
  DecisionDashboard, 
  DecisionRecommendation, 
  DecisionSummaryForAI 
} from './decisionTypes.ts';

export class DecisionService {
  /**
   * Obtém o dashboard completo do Decision Engine
   */
  async getDashboard(organizationId: string, propertyId: string): Promise<DecisionDashboard> {
    return decisionRepository.getDashboard(organizationId, propertyId);
  }

  /**
   * Obtém todas as recomendações em fila de aprovação humana
   */
  async getRecommendations(organizationId: string, propertyId: string): Promise<DecisionRecommendation[]> {
    const dash = await decisionRepository.getDashboard(organizationId, propertyId);
    return dash.executiveActionQueue;
  }

  /**
   * Obtém as prioridades diárias e gargalos críticos
   */
  async getPriorities(organizationId: string, propertyId: string) {
    const dash = await decisionRepository.getDashboard(organizationId, propertyId);
    return {
      dailyPriorities: dash.dailyPriorities,
      criticalBottlenecks: dash.criticalBottlenecks,
      highestPriorityAction: dash.highestPriorityAction,
      quickWins: dash.quickWins
    };
  }

  /**
   * Obtém o resumo executivo das recomendações
   */
  async getSummary(organizationId: string, propertyId: string) {
    const dash = await decisionRepository.getDashboard(organizationId, propertyId);
    return {
      totalPendingRecommendations: dash.totalPendingRecommendations,
      criticalRecommendationsCount: dash.criticalRecommendationsCount,
      confidenceAverage: dash.confidenceAverage,
      highestPriorityAction: dash.highestPriorityAction
    };
  }

  /**
   * Retorna o resumo ultra-compacto para o ContextService da IA (evita estouro de janela)
   */
  async getDecisionSummaryForAI(organizationId: string, propertyId: string): Promise<DecisionSummaryForAI> {
    const dash = await decisionRepository.getDashboard(organizationId, propertyId);
    return {
      totalRecommendations: dash.totalPendingRecommendations,
      criticalRecommendations: dash.criticalRecommendationsCount,
      highestPriority: dash.highestPriorityAction,
      nextRecommendedAction: dash.executiveActionQueue[0]?.description || 'Acompanhar indicadores de rotina',
      confidenceAverage: dash.confidenceAverage
    };
  }
}

export const decisionService = new DecisionService();
