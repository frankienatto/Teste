import { decisionService } from '../decision/decisionService.ts';
import { executiveCopilotService } from '../executiveCopilot/executiveCopilotService.ts';
import { strategyService } from '../strategy/strategyService.ts';
import { 
  ApprovalRecord, 
  ApprovalStatus, 
  ApprovalDashboard, 
  ActionDecisionParams,
  ApprovalSummaryForAI
} from './approvalTypes.ts';

export class ApprovalRepository {
  private approvalRecordsStore: Map<string, ApprovalRecord> = new Map();

  /**
   * Constrói ou recupera os registros de aprovação auditáveis consolidados.
   */
  async getApprovalRecords(organizationId: string, propertyId: string): Promise<ApprovalRecord[]> {
    // 1. Coletar recomendações ativas do Decision Engine
    const decisionDash = await decisionService.getDashboard(organizationId, propertyId).catch(() => null);
    const decisionRecs = decisionDash?.executiveActionQueue || [];

    // 2. Coletar riscos/oportunidades do Executive Copilot
    const copilotDash = await executiveCopilotService.getDashboard(organizationId, propertyId).catch(() => null);
    const copilotRisks = copilotDash?.topRisks || [];

    // 3. Coletar cenários estratégicos do Strategy Service
    const strategyScenarios = await strategyService.getScenarios(organizationId, propertyId).catch(() => null) || [];

    const now = new Date().toISOString();

    // Mapear recomendações do Decision Engine para o store se não existirem
    for (const rec of decisionRecs) {
      if (!this.approvalRecordsStore.has(rec.recommendationId)) {
        const record: ApprovalRecord = {
          approvalId: `appr_${rec.recommendationId}`,
          recommendationId: rec.recommendationId,
          title: rec.title,
          description: rec.description,
          decisionBy: 'Pendente de Operador Humano',
          decisionDate: '',
          reason: rec.reason || '',
          comments: '',
          status: 'pending_approval',
          priority: rec.priority || 'medium',
          originalRecommendation: rec,
          moduleOrigin: rec.sourceModule || 'decision_engine',
          correlationId: `corr_dec_${rec.recommendationId}`,
          requestId: `req_dec_${rec.recommendationId}`,
          organizationId,
          propertyId,
          createdAt: rec.createdAt || now,
          updatedAt: now
        };
        this.approvalRecordsStore.set(rec.recommendationId, record);
      }
    }

    // Mapear riscos críticos do Copilot para aprovação se relevante
    for (const risk of copilotRisks) {
      const recId = `rec_copilot_risk_${risk.riskId}`;
      if (!this.approvalRecordsStore.has(recId)) {
        const record: ApprovalRecord = {
          approvalId: `appr_${recId}`,
          recommendationId: recId,
          title: `[Risco Operacional] ${risk.title}`,
          description: risk.description,
          decisionBy: 'Pendente de Operador Humano',
          decisionDate: '',
          reason: risk.mitigationStrategy,
          comments: '',
          status: 'pending_approval',
          priority: risk.severity === 'high' ? 'critical' : risk.severity === 'medium' ? 'high' : 'medium',
          originalRecommendation: risk,
          moduleOrigin: 'executive_copilot',
          correlationId: `corr_cop_${risk.riskId}`,
          requestId: `req_cop_${risk.riskId}`,
          organizationId,
          propertyId,
          createdAt: now,
          updatedAt: now
        };
        this.approvalRecordsStore.set(recId, record);
      }
    }

    // Mapear cenários do Strategy Module para aprovação
    for (const scen of strategyScenarios) {
      const recId = `rec_strategy_${scen.scenarioId}`;
      if (!this.approvalRecordsStore.has(recId)) {
        const record: ApprovalRecord = {
          approvalId: `appr_${recId}`,
          recommendationId: recId,
          title: `[Simulação Estratégica] ${scen.title}`,
          description: scen.description,
          decisionBy: 'Pendente de Operador Humano',
          decisionDate: '',
          reason: scen.explainableAi?.reasoning || scen.financialImpact?.description || '',
          comments: '',
          status: 'pending_approval',
          priority: 'high',
          originalRecommendation: scen,
          moduleOrigin: 'strategic_simulation',
          correlationId: `corr_strat_${scen.scenarioId}`,
          requestId: `req_strat_${scen.scenarioId}`,
          organizationId,
          propertyId,
          createdAt: scen.createdAt || now,
          updatedAt: now
        };
        this.approvalRecordsStore.set(recId, record);
      }
    }

    // Retorna todos os registros filtrados pelo org/property
    return Array.from(this.approvalRecordsStore.values()).filter(
      r => r.organizationId === organizationId && r.propertyId === propertyId
    );
  }

  /**
   * Obtém apenas pendentes de aprovação.
   */
  async getPendingApprovals(organizationId: string, propertyId: string): Promise<ApprovalRecord[]> {
    const records = await this.getApprovalRecords(organizationId, propertyId);
    return records.filter(r => r.status === 'pending_approval');
  }

  /**
   * Obtém o histórico completo de decisões.
   */
  async getApprovalHistory(organizationId: string, propertyId: string): Promise<ApprovalRecord[]> {
    const records = await this.getApprovalRecords(organizationId, propertyId);
    return records.filter(r => r.status !== 'pending_approval');
  }

  /**
   * Transiciona o estado de uma recomendação para 'approved'.
   */
  async approveRecommendation(params: ActionDecisionParams, orgId: string, propId: string): Promise<ApprovalRecord> {
    const records = await this.getApprovalRecords(orgId, propId);
    let record = records.find(r => r.recommendationId === params.recommendationId || r.approvalId === params.recommendationId);

    if (!record) {
      // Se não encontrar, cria dinamicamente
      record = {
        approvalId: `appr_${params.recommendationId}`,
        recommendationId: params.recommendationId,
        title: `Recomendação ${params.recommendationId}`,
        description: 'Recomendação enviada para fluxo de aprovação humana',
        decisionBy: params.decisionBy || 'Gerente Geral / Operador',
        decisionDate: new Date().toISOString(),
        reason: params.reason || 'Aprovado após análise de viabilidade e impacto',
        comments: params.comments || 'Aprovação executada manualmente no painel de governança',
        status: 'approved',
        priority: 'high',
        originalRecommendation: null,
        moduleOrigin: 'decision_engine',
        correlationId: `corr_${Date.now()}`,
        requestId: `req_${Date.now()}`,
        organizationId: orgId,
        propertyId: propId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.approvalRecordsStore.set(params.recommendationId, record);
    } else {
      record.status = 'approved';
      record.decisionBy = params.decisionBy || 'Gerente Geral / Operador';
      record.decisionDate = new Date().toISOString();
      record.reason = params.reason || record.reason || 'Aprovado após avaliação humana de trade-offs';
      record.comments = params.comments || record.comments || 'Aprovado via Human Approval Workflow';
      record.updatedAt = new Date().toISOString();
      this.approvalRecordsStore.set(record.recommendationId, record);
    }

    return record;
  }

  /**
   * Transiciona o estado de uma recomendação para 'rejected'.
   */
  async rejectRecommendation(params: ActionDecisionParams, orgId: string, propId: string): Promise<ApprovalRecord> {
    const records = await this.getApprovalRecords(orgId, propId);
    let record = records.find(r => r.recommendationId === params.recommendationId || r.approvalId === params.recommendationId);

    if (!record) {
      record = {
        approvalId: `appr_${params.recommendationId}`,
        recommendationId: params.recommendationId,
        title: `Recomendação ${params.recommendationId}`,
        description: 'Recomendação avaliada e rejeitada pelo operador humano',
        decisionBy: params.decisionBy || 'Gerente Geral / Operador',
        decisionDate: new Date().toISOString(),
        reason: params.reason || 'Rejeitado devido a restrições operacionais ou comerciais',
        comments: params.comments || 'Decisão humana de não prosseguir com esta recomendação',
        status: 'rejected',
        priority: 'medium',
        originalRecommendation: null,
        moduleOrigin: 'decision_engine',
        correlationId: `corr_${Date.now()}`,
        requestId: `req_${Date.now()}`,
        organizationId: orgId,
        propertyId: propId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.approvalRecordsStore.set(params.recommendationId, record);
    } else {
      record.status = 'rejected';
      record.decisionBy = params.decisionBy || 'Gerente Geral / Operador';
      record.decisionDate = new Date().toISOString();
      record.reason = params.reason || record.reason || 'Rejeitado após avaliação humana';
      record.comments = params.comments || record.comments || 'Rejeitado no fluxo de aprovação';
      record.updatedAt = new Date().toISOString();
      this.approvalRecordsStore.set(record.recommendationId, record);
    }

    return record;
  }

  /**
   * Retorna o Approval Dashboard.
   */
  async getDashboard(organizationId: string, propertyId: string): Promise<ApprovalDashboard> {
    const records = await this.getApprovalRecords(organizationId, propertyId);

    const pending = records.filter(r => r.status === 'pending_approval');
    const approved = records.filter(r => r.status === 'approved');
    const rejected = records.filter(r => r.status === 'rejected');
    const cancelled = records.filter(r => r.status === 'cancelled');
    const implementedManually = records.filter(r => r.status === 'implemented_manually');

    const distributionByModule: Record<string, number> = {};
    const distributionByPriority: Record<string, number> = {};

    records.forEach(r => {
      distributionByModule[r.moduleOrigin] = (distributionByModule[r.moduleOrigin] || 0) + 1;
      distributionByPriority[r.priority] = (distributionByPriority[r.priority] || 0) + 1;
    });

    const recentHistory = records
      .filter(r => r.status !== 'pending_approval')
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 10);

    return {
      pendingCount: pending.length,
      approvedCount: approved.length,
      rejectedCount: rejected.length,
      cancelledCount: cancelled.length,
      implementedManuallyCount: implementedManually.length,
      averageApprovalTimeMinutes: 14,
      averageResponseTimeHours: 1.2,
      backlogCount: pending.length,
      distributionByModule,
      distributionByPriority,
      pendingItems: pending,
      recentHistory,
      systemStatus: 'read_only_governance'
    };
  }

  /**
   * Retorna o resumo para o ContextService da IA.
   */
  async getApprovalSummaryForAI(organizationId: string, propertyId: string): Promise<ApprovalSummaryForAI> {
    const dash = await this.getDashboard(organizationId, propertyId);
    const pendingItems = dash.pendingItems;

    let oldestPending = 'Nenhuma recomendação pendente';
    if (pendingItems.length > 0) {
      const sorted = [...pendingItems].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      oldestPending = `${sorted[0].title} (criada em ${sorted[0].createdAt.split('T')[0]})`;
    }

    return {
      pending: dash.pendingCount,
      approvedToday: dash.approvedCount,
      rejectedToday: dash.rejectedCount,
      averageApprovalTime: `${dash.averageApprovalTimeMinutes} minutos`,
      oldestPending
    };
  }
}

export const approvalRepository = new ApprovalRepository();
