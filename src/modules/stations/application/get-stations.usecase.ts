/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 */

import { OperationalDashboard, StationRepository } from '../domain/station.entity';

export class GetStationsUseCase {
  constructor(private readonly stationRepository: StationRepository) {}

  async execute(contract: 'valence' | 'seville'): Promise<OperationalDashboard> {
    // Llamamos al nuevo método del repositorio analítico avanzado
    return await this.stationRepository.getDashboardData(contract);
  }
}
