import { reservationService, ReservationService } from '../pms/reservationService.ts';
import { pmsService, PmsService } from '../pms/pmsService.ts';
import { Reservation } from '../pms/reservationTypes.ts';
import { RoomCategory, RoomUnit } from '../pms/pmsTypes.ts';

export class RevenueRepository {
  private resService: ReservationService;
  private pmsSvc: PmsService;

  constructor(
    resService: ReservationService = reservationService,
    pmsSvc: PmsService = pmsService
  ) {
    this.resService = resService;
    this.pmsSvc = pmsSvc;
  }

  /**
   * Obtém lista de reservas via ReservationService
   */
  async getReservations(organizationId: string, propertyId: string): Promise<Reservation[]> {
    return this.resService.listReservations(organizationId, propertyId);
  }

  /**
   * Obtém categorias de acomodação via PmsService
   */
  async getCategories(organizationId: string, propertyId: string): Promise<RoomCategory[]> {
    return this.pmsSvc.listCategories(organizationId, propertyId, true);
  }

  /**
   * Obtém unidades hoteleiras (UHs) via PmsService
   */
  async getUnits(organizationId: string, propertyId: string): Promise<RoomUnit[]> {
    return this.pmsSvc.listUnits(organizationId, propertyId);
  }
}

export const revenueRepository = new RevenueRepository();
