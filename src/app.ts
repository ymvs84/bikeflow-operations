/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 *
 * Punto de entrada principal y cableado de dependencias de la API BikeFlow.
 */

import express from 'express';
import dotenv from 'dotenv';
import { GbfsStationRepository } from './modules/stations/infrastructure/gbfs/gbfs.repository';
import { GetStationsUseCase } from './modules/stations/application/get-stations.usecase';
import { StationsController } from './modules/stations/infrastructure/http/stations.controller';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(express.static('public')); // Servir archivos estáticos desde la carpeta 'public'

// --- Inyección de Dependencias (Estándar Clean Architecture) ---
const stationRepository = new GbfsStationRepository();
const getStationsUseCase = new GetStationsUseCase(stationRepository);
const stationsController = new StationsController(getStationsUseCase);

// Endpoint de control de salud (Health Check)
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date(),
    environment: 'development'
  });
});

// Endpoint oficial de la API de Movilidad para BikeFlow
app.get('/api/stations', (req, res) => stationsController.handle(req, res));

// Configuración de escucha en '0.0.0.0' para abrir el servicio a la red local
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor de BikeFlow activo en red local: http://0.0.0.0:${PORT}`);
});
