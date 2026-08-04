import { OperationalContext } from './aiTypes.ts';
import { sessionMemory } from './sessionMemory.ts';
import { organizationRepository } from '../saas/organizationRepository.ts';

export class ContextService {
  /**
   * Constrói e retorna o objeto estruturado OperationalContext.
   * Não formata strings de prompt ou templates (responsabilidade do Prompt Registry).
   * Lê dados do tenant/propriedade/usuário diretamente do repositório desacoplado.
   */
  async buildOperationalContext(
    organizationId: string,
    propertyId?: string,
    userId?: string,
    sessionId?: string
  ): Promise<OperationalContext> {
    // 1. Leitura de Organização
    const orgData = await organizationRepository.getOrganizationById(organizationId);
    const organization = orgData ? {
      organizationId: orgData.organizationId,
      name: orgData.name,
      plan: orgData.plan
    } : null;

    // 2. Leitura de Propriedade
    let property = null;
    if (propertyId) {
      const propData = await organizationRepository.getPropertyById(propertyId);
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

    return {
      organization,
      property,
      user,
      sessionHistory,
      metadata: {
        timestamp: new Date().toISOString(),
        resolvedFrom: 'organizationRepository'
      }
    };
  }
}

export const contextService = new ContextService();
