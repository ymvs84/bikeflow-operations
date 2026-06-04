/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 *
 * Implementación de producción del repositorio analítico de estaciones utilizando el estándar GBFS.
 */

import { OperationalDashboard, Station, StationRepository } from '../../domain/station.entity';
import { GbfsMapper } from './gbfs.mapper';

export class GbfsStationRepository implements StationRepository {
  private readonly baseUrl = 'https://api.cyclocity.fr/contracts';

  async getDashboardData(contract: 'valence' | 'seville'): Promise<OperationalDashboard> {
    try {
      // 1. Descarga concurrente de los feeds clave de JCDecaux / Cyclocity
      const [systemRes, infoRes, statusRes] = await Promise.all([
        fetch(`${this.baseUrl}/${contract}/gbfs/system_information.json`),
        fetch(`${this.baseUrl}/${contract}/gbfs/station_information.json`),
        fetch(`${this.baseUrl}/${contract}/gbfs/station_status.json`)
      ]);

      if (!systemRes.ok || !infoRes.ok || !statusRes.ok) {
        throw new Error(`[GBFS] Error al descargar los feeds para el contrato: ${contract}`);
      }

      const systemData = await systemRes.json();
      const infoData = await infoRes.json();
      const statusData = await statusRes.json();

      const sysInfo = systemData.data;
      const stationsInfo = infoData.data.stations || [];
      const stationsStatus = statusData.data.stations || [];

      // ===== CHIVATO DE DIAGNÓSTICO TEMPORAL PARA VALENCIA =====
      if (contract === 'valence') {
        console.log('======================================================');
        console.log('[DEBUG VALENCIA] Primer elemento de INFO (Estático):', JSON.stringify(stationsInfo[0], null, 2));
        console.log('[DEBUG VALENCIA] Primer elemento de STATUS (Dinámico):', JSON.stringify(stationsStatus[0], null, 2));
        console.log('======================================================');
      }
      // ========================================================

      // 2. Cruce de datos blindado convirtiendo explícitamente ambos lados a String
      const stations: Station[] = stationsInfo
        .filter((info: any) => info && (info.station_id || info.id))
        .map((info: any) => {
          const infoId = String(info.station_id || info.id).trim();

          // Buscamos el estado asegurando que la comparación sea texto contra texto
          const status = stationsStatus.find((s: any) => {
            if (!s) return false;
            const sId = s.station_id || s.id;
            return sId ? String(sId).trim() === infoId : false;
          });

          return GbfsMapper.toDomain(info, status || {}, contract);
        });

      // 3. Procesamiento analítico en caliente para el cuadro de mando de operaciones
      let openStations = 0;
      let totalBikes = 0;
      let totalStands = 0;
      let criticalEmpty = 0;
      let criticalFull = 0;

      stations.forEach(s => {
        if (s.status === 'OPEN') openStations++;
        totalBikes += s.bikesAvailable;
        totalStands += s.standsAvailable;

        // Reglas de negocio del semáforo operacional (0 bicis o 0 bornas)
        if (s.status === 'OPEN' && s.bikesAvailable === 0) criticalEmpty++;
        if (s.status === 'OPEN' && s.standsAvailable === 0) criticalFull++;
      });

      // 4. Retorno de la estructura del Dashboard corporativo
      return {
        system: {
          name: sysInfo.name || (contract === 'valence' ? 'Valenbisi' : 'SEVIci'),
          operator: sysInfo.operator || 'JCDecaux',
          city: contract
        },
        kpis: {
          totalStations: stations.length,
          openStations,
          closedStations: stations.length - openStations,
          totalBikesAvailable: totalBikes,
          totalStandsAvailable: totalStands,
          criticalEmptyStations: criticalEmpty,
          criticalFullStations: criticalFull
        },
        stations
      };
    } catch (error) {
      console.error(`[GbfsStationRepository] Error crítico en contrato [${contract}]:`, error);
      throw error;
    }
  }
}
