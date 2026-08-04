import { OperationalContext } from './aiTypes.ts';
import { sessionMemory } from './sessionMemory.ts';
import { organizationRepository } from '../saas/organizationRepository.ts';
import { pmsService } from '../pms/pmsService.ts';
import { reservationService } from '../pms/reservationService.ts';

export class ContextService {
  /**
   * Constrói e retorna o objeto estruturado OperationalContext.
   * Não formata strings de prompt ou templates (responsabilidade do Prompt Registry).
   * Lê dados do tenant/propriedade/usuário e consome o PMS via pmsService e reservationService (sem acessar repositórios diretamente).
   */
  async buildOperationalContext(
    organizationId: string,
    propertyId?: string,
    userId?: string,
    sessionId?: string
  ): Promise<OperationalContext> {
    const resolvedOrgId = organizationId || 'org_dev_default';
    const resolvedPropId = propertyId || 'prop_dev_default';

    // 1. Leitura de Organização
    const orgData = await organizationRepository.getOrganizationById(resolvedOrgId);
    const organization = orgData ? {
      organizationId: orgData.organizationId,
      name: orgData.name,
      plan: orgData.plan
    } : null;

    // 2. Leitura de Propriedade
    let property = null;
    if (resolvedPropId) {
      const propData = await organizationRepository.getPropertyById(resolvedPropId);
      if (propData) {
        property = {
          propertyId: propData.propertyId,
          name: propData.name,
          type: propData.type
        };
      }
    }

    // 3. Leitura de Usuário
    let user = null;
    if (userId) {
      const userData = await organizationRepository.getUserById(userId);
      if (userData) {
        user = {
          userId: userData.userId,
          name: userData.name,
          role: userData.role
        };
      }
    }

    // 4. Leitura do Histórico Recente de Sessão (Memory)
    const sessionHistory = sessionId 
      ? await sessionMemory.getRecentMessages(sessionId) 
      : [];

    // 5. Integração com o PMS (Etapa 4.3): Consulta de dados em tempo real via Services (pmsService e reservationService)
    let pmsData = null;
    try {
      const [categories, units, inventorySummary, reservations] = await Promise.all([
        pmsService.listCategories(resolvedOrgId, resolvedPropId),
        pmsService.listUnits(resolvedOrgId, resolvedPropId),
        pmsService.getInventorySummary(resolvedOrgId, resolvedPropId),
        reservationService.listReservations(resolvedOrgId, resolvedPropId)
      ]);

      const activeReservations = reservations.filter(r => r.status === 'confirmed' || r.status === 'checked_in');
      const occupiedUnitsCount = reservations.filter(r => r.status === 'checked_in').length;
      const totalUnitsCount = inventorySummary.totalUnits || 1;
      const occupancyRatePercent = Number(((occupiedUnitsCount / totalUnitsCount) * 100).toFixed(1));

      pmsData = {
        categories,
        units,
        reservations,
        summary: {
          totalCategories: inventorySummary.totalCategories,
          totalUnits: inventorySummary.totalUnits,
          activeUnits: inventorySummary.activeUnitsCount,
          occupiedUnits: occupiedUnitsCount,
          dirtyUnits: inventorySummary.unitsByStatus.dirty,
          cleanUnits: inventorySummary.unitsByStatus.clean,
          inspectedUnits: inventorySummary.unitsByStatus.inspected,
          maintenanceUnits: inventorySummary.unitsByStatus.maintenance,
          outOfServiceUnits: inventorySummary.unitsByStatus.out_of_service,
          occupancyRatePercent,
          totalActiveReservations: activeReservations.length
        }
      };
    } catch (err: any) {
      console.warn("⚠️ [ContextService] Erro ao carregar contexto PMS via Services:", err?.message || err);
    }

    return {
      organization,
      property,
      user,
      pmsData,
      sessionHistory,
      metadata: {
        timestamp: new Date().toISOString(),
        resolvedFrom: 'pmsService_and_reservationService'
      }
    };
  }
}

export const contextService = new ContextService();
