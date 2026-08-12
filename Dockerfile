# Imagen base ligera de Node.js 20 sobre Alpine Linux
FROM node:20-alpine

# Directorio de trabajo en el contenedor
WORKDIR /app

# Copiar manifiestos de dependencias
COPY package*.json ./

# Instalar dependencias del proyecto
RUN npm ci

# Copiar el resto del código fuente y archivos públicos
COPY . .

# Exponer el puerto configurado
EXPOSE 3000

# Comando para ejecutar el servicio en producción
CMD ["npm", "run", "dev"]
