/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 */

import { Request, Response } from 'express';
import { GetStationsUseCase } from '../../application/get-stations.usecase';

export class StationsController {
  constructor(private readonly getStationsUseCase: GetStationsUseCase) {}

  async handle(req: Request, res: Response): Promise<void> {
    try {
      const { contract } = req.query;

      if (contract !== 'valence' && contract !== 'seville') {
        res.status(400).json({
          error: 'Bad Request',
          message: "El parámetro 'contract' es obligatorio y debe ser 'valence' o 'seville'."
        });
        return;
      }

      // 'dashboard' contiene ahora: { system, kpis, stations }
      const dashboard = await this.getStationsUseCase.execute(contract);

      res.setHeader('Cache-Control', 'public, max-age=60');
      res.status(200).json(dashboard);
    } catch (error) {
      console.error('[StationsController] Error:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Error interno al procesar las analíticas de estaciones.'
      });
    }
  }
}
