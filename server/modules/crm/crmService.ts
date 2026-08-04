import { 
  GuestProfile, 
  CreateGuestDTO, 
  UpdateGuestDTO, 
  GuestQueryFilters, 
  GuestStayRecord, 
  GuestMetricsSummary, 
  GuestClassification 
} from './guestTypes.ts';
import { guestRepository } from './guestRepository.ts';

export class CrmService {
  /**
   * Cria um perfil de hóspede vinculado à Organização
   */
  async createGuest(organizationId: string, dto: CreateGuestDTO): Promise<GuestProfile> {
    const primaryDoc = dto.documents && dto.documents.length > 0 ? dto.documents[0].number : undefined;

    // Verificar se hóspede já existe na Organização
    const existing = await guestRepository.findByEmailOrDocument(organizationId, dto.email, primaryDoc);
    if (existing) {
      // Se existir, atualiza dados sem duplicar
      return this.updateGuest(existing.guestId, dto);
    }

    const now = new Date().toISOString();
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newGuest: GuestProfile = {
      guestId,
      organizationId,
      fullName: dto.fullName.trim(),
      email: dto.email.trim().toLowerCase(),
      phone: dto.phone.trim(),
      secondaryPhone: dto.secondaryPhone,
      primaryLanguage: dto.primaryLanguage || 'pt-BR',
      nationality: dto.nationality || 'Brasileira',
      classification: dto.classification || 'standard',
      tags: dto.tags || [],
      documents: dto.documents || [],
      preferences: dto.preferences || {},
      stayHistory: [],
      totalStaysCount: 0,
      totalSpentAmount: 0,
      createdAt: now,
      updatedAt: now
    };

    return guestRepository.save(newGuest);
  }

  /**
   * Atualiza dados cadastrais ou preferências de um hóspede
   */
  async updateGuest(guestId: string, dto: UpdateGuestDTO): Promise<GuestProfile> {
    const guest = await guestRepository.findById(guestId);
    if (!guest) {
      throw new Error(`Hóspede com ID [${guestId}] não encontrado.`);
    }

    const now = new Date().toISOString();

    const updated: GuestProfile = {
      ...guest,
      fullName: dto.fullName !== undefined ? dto.fullName.trim() : guest.fullName,
      email: dto.email !== undefined ? dto.email.trim().toLowerCase() : guest.email,
      phone: dto.phone !== undefined ? dto.phone.trim() : guest.phone,
      secondaryPhone: dto.secondaryPhone !== undefined ? dto.secondaryPhone : guest.secondaryPhone,
      primaryLanguage: dto.primaryLanguage !== undefined ? dto.primaryLanguage : guest.primaryLanguage,
      nationality: dto.nationality !== undefined ? dto.nationality : guest.nationality,
      classification: dto.classification !== undefined ? dto.classification : guest.classification,
      tags: dto.tags !== undefined ? Array.from(new Set([...guest.tags, ...dto.tags])) : guest.tags,
      documents: dto.documents !== undefined ? dto.documents : guest.documents,
      preferences: dto.preferences !== undefined ? { ...guest.preferences, ...dto.preferences } : guest.preferences,
      updatedAt: now
    };

    return guestRepository.save(updated);
  }

  /**
   * Registra uma nova estadia no histórico do hóspede e recalcula a classificação
   */
  async recordStay(
    guestId: string, 
    stayData: Omit<GuestStayRecord, 'stayId' | 'createdAt'>
  ): Promise<GuestProfile> {
    const guest = await guestRepository.findById(guestId);
    if (!guest) {
      throw new Error(`Hóspede com ID [${guestId}] não encontrado.`);
    }

    const stayId = `stay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const stay: GuestStayRecord = {
      ...stayData,
      stayId,
      createdAt: new Date().toISOString()
    };

    const updatedGuest = await guestRepository.addStay(guestId, stay);
    if (!updatedGuest) {
      throw new Error(`Erro ao registrar estadia no perfil do hóspede [${guestId}].`);
    }

    // Recalcular classificação dinâmica (ex: frequent se >= 3 estadias, vip se >= 10 ou receita relevante)
    let newClassification: GuestClassification = updatedGuest.classification;

    if (updatedGuest.classification !== 'blacklisted' && updatedGuest.classification !== 'corporate') {
      if (updatedGuest.totalStaysCount >= 10 || updatedGuest.totalSpentAmount >= 15000) {
        newClassification = 'vip';
      } else if (updatedGuest.totalStaysCount >= 3) {
        newClassification = 'frequent';
      }
    }

    if (newClassification !== updatedGuest.classification) {
      updatedGuest.classification = newClassification;
      await guestRepository.save(updatedGuest);
    }

    return updatedGuest;
  }

  /**
   * Busca perfil por ID
   */
  async getGuestById(guestId: string): Promise<GuestProfile | null> {
    return guestRepository.findById(guestId);
  }

  /**
   * Lista hóspedes da Organização com suporte a busca e filtros
   */
  async listGuests(organizationId: string, filters?: GuestQueryFilters): Promise<GuestProfile[]> {
    return guestRepository.listByOrganization(organizationId, filters);
  }

  /**
   * Métricas do CRM em nível de Organização
   */
  async getMetrics(organizationId: string): Promise<GuestMetricsSummary> {
    const guests = await guestRepository.listByOrganization(organizationId);

    const vipCount = guests.filter(g => g.classification === 'vip').length;
    const frequentCount = guests.filter(g => g.classification === 'frequent').length;
    const totalStays = guests.reduce((sum, g) => sum + g.totalStaysCount, 0);
    const totalRevenue = guests.reduce((sum, g) => sum + g.totalSpentAmount, 0);

    return {
      organizationId,
      totalGuests: guests.length,
      vipGuestsCount: vipCount,
      frequentGuestsCount: frequentCount,
      totalStaysRecorded: totalStays,
      totalRevenueGenerated: totalRevenue
    };
  }
}

export const crmService = new CrmService();
