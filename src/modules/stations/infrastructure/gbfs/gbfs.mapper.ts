/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 */

import { Station } from '../../domain/station.entity';

export class GbfsMapper {
  static toDomain(info: any, status: any, contract: 'valence' | 'seville'): Station {
    // Forzamos la extracción de ID normalizada a String puro
    const rawId = info.station_id || info.id || status.station_id || 'unknown';
    const cleanId = String(rawId).trim();

    const bikes = Number(status.num_bikes_available !== undefined ? status.num_bikes_available : 0);
    const docks = Number(status.num_docks_available !== undefined ? status.num_docks_available : 0);

    const isOpen = status.is_renting === 1 || status.is_renting === true || (bikes + docks > 0);

    return {
      id: `${contract}-${cleanId}`,
      number: cleanId,
      contractName: contract,
      name: info.name || 'Estación sin nombre',
      address: info.address || '',
      status: isOpen ? 'OPEN' : 'CLOSED',
      position: {
        latitude: Number(info.lat || info.latitude || 0),
        longitude: Number(info.lon || info.longitude || 0)
      },
      capacity: Number(info.capacity || (bikes + docks) || 0),
      bikesAvailable: bikes,
      standsAvailable: docks,
      lastUpdate: status.last_reported ? new Date(status.last_reported * 1000) : new Date()
    };
  }
}
