/**
 * Autor: Yago Menéndez de la Vega Sepúlveda
 * Puesto: IT Support Engineer | Operations
 * Empresa: JCDecaux España
 *
 * Centralización y validación estricta de las variables de entorno.
 */

import dotenv from 'dotenv';
dotenv.config();

export const env = {
  PORT: process.env.PORT || '3000',
  NODE_ENV: process.env.NODE_ENV || 'development',
  jcdecaux: {
    apiKey: process.env.JCDECAUX_API_KEY || '',
    baseUrlRest: 'https://api.jcdecaux.com/vls/v1'
  }
};

// Control de calidad en desarrollo: Avisar si falta la clave corporativa
if (!env.jcdecaux.apiKey && env.NODE_ENV === 'development') {
  console.warn('⚠️ [Config] Advertencia: JCDECAUX_API_KEY no está configurada en el archivo .env');
}
