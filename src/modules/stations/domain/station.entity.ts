/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 */

export interface Station {
  id: string;
  number: string;
  contractName: 'valence' | 'seville';
  name: string;
  address?: string;
  status: 'OPEN' | 'CLOSED';
  position: { latitude: number; longitude: number; };
  capacity: number;
  bikesAvailable: number;
  standsAvailable: number;
  lastUpdate: Date;
}

// Estructura de alto potencial para el equipo de Operaciones
export interface OperationalDashboard {
  system: {
    name: string;
    operator: string;
    city: string;
  };
  kpis: {
    totalStations: number;
    openStations: number;
    closedStations: number;
    totalBikesAvailable: number;
    totalStandsAvailable: number;
    criticalEmptyStations: number;  // Estaciones sin bicis (Alerta de redistribución)
    criticalFullStations: number;   // Estaciones llenas (No se puede aparcar)
  };
  stations: Station[];
}

export interface StationRepository {
  getDashboardData(contract: 'valence' | 'seville'): Promise<OperationalDashboard>;
}
