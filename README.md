# 🏢 JCDecaux | BikeFlow Operations — Centro de Control GBFS 🚲

> **Solución corporativa y analítica para la monitorización, auditoría y balance logístico en tiempo real de redes terrestres de bicicletas compartidas.**

![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)
![Express](https://img.shields.io/badge/Express-4.19-lightgrey.svg)
![Tailwind](https://img.shields.io/badge/Tailwind--CSS-v4.0-38bdf8.svg)
![Status](https://img.shields.io/badge/Status-Desarrollo%20--%20Operativo-emerald)

---

## 📋 Contexto y Motivación

Este proyecto nace de la necesidad de optimizar las tareas de balance y mantenimiento en la vía pública de las flotas de bicicletas integradas en los servicios gestionados por JCDecaux España.

* **Problemática:** Los operadores y brigadas de reparto en calle requieren una visibilidad inmediata y unificada del estado de los terminales sin necesidad de procesar feeds de datos JSON en crudo complejos.
* **Solución:** Desarrollo de una plataforma analítica centralizada que consume los feeds en tiempo real bajo el estándar internacional **GBFS (General Bikeshare Feed Specification)** de Cyclocity, unificando los contratos de **Valenbisi (Valencia)** y **SEVIci (Sevilla)** en una interfaz unificada de alto impacto visual.
* **Impacto Operativo:** Automatización del cálculo de KPIs críticos (desabastecimiento y saturación) para coordinar de forma predictiva las furgonetas de reparto terrestre.

---

## 🛠️ Arquitecture Técnica

El sistema ha sido estructurado siguiendo los principios de la **Arquitectura Limpia (Clean Architecture)** y **Domain-Driven Design (DDD)** para desacoplar completamente la lógica de negocio de los proveedores de infraestructura externos.

```text
📂 bikeflow
├── 📂 src
│   ├── 📂 modules
│   │   └── 📂 stations
│   │       ├── 📂 domain          # Entidades puras de negocio e interfaces de contratos
│   │       ├── 📂 application     # Casos de uso desacoplados (GetStationsUseCase)
│   │       └── 📂 infrastructure  # Clientes API (GBFS), Mappers y Controladores Express HTTP
│   └── index.ts                   # Bootstrap de la aplicación backend
└── 📂 public                      # Frontend Single Page (HTML5, Tailwind Engine V4, Leaflet.js)

```

* **Frontend:** Interfaz limpia diurna interactiva, Tailwind CSS v4 para rendimiento en renderizado y **Leaflet.js** consumiendo OpenStreetMap nativo para un posicionamiento de precisión sin coste de licenciamiento propietario.
* **Backend:** Node.js + TypeScript con Express. Arquitectura modular adaptada a la inyección de dependencias para permitir escalar a nuevos contratos de ciudades de forma inmediata.

---

## 🚦 Semáforo de Operaciones Terrestres

El visor cartográfico y las tarjetas analíticas aplican reglas de negocio automatizadas basadas en la criticidad logística de la infraestructura terrestre:

* 🟢 **Verde (Estado OK):** Estación operativa en régimen normal con disponibilidad equilibrada.
* 🟠 **Naranja (Acción: Reparto Requerido):** Estación crítica con `0` bicicletas disponibles. Alerta inminente por desabastecimiento.
* 🔴 **Rojo (Acción: Descarga Urgente):** Estación crítica con `0` bornas libres. Alerta por bloqueo de red y saturación de devoluciones.
* ⚫ **Gris (Offline):** Estación fuera de servicio o en parada de mantenimiento lógico por IT.

---

## ⚙️ Instalación y Configuración

El entorno de desarrollo está preparado para su ejecución local o despliegue en servidor de aplicaciones local:

### 1. Clonado del Proyecto e Instalación

```bash
# Clonar repositorio (o mover a tu espacio de trabajo corporativo)
cd bikeflow

# Instalar árbol de dependencias
npm install

```

### 2. Configuración del Entorno

Crear un archivo `.env` en la raíz del proyecto para pautar el puerto de escucha del servidor Express:

```env
PORT=3000

```

---

## ▶️ Ejecución

El proyecto está configurado con recarga en caliente automatizada para facilitar el debug operativo en local:

```bash
# Inicializar el servidor backend y compilar TypeScript al vuelo
npm run dev

```

Una vez levantado el servicio sin errores (`🚀 Servidor de BikeFlow corriendo...`), abre el navegador y accede al cuadro de mando centralizado mediante:
👉 `http://localhost:3000`

---

## 📊 Endpoints de la API Analítica (Backend)

El servidor procesa en caliente las llamadas a los feeds JSON de Cyclocity e inyecta la lógica analítica de los KPIs globales. Puede consultarse de forma aislada para auditorías de datos:

* **Malla de Valencia (Valenbisi):** `GET /api/stations?contract=valence`
* **Malla de Sevilla (SEVIci):** `GET /api/stations?contract=seville`

**Estructura del Payload de Retorno:**

```json
{
  "system": { "name": "Valenbisi", "operator": "JCDecaux", "city": "valence" },
  "kpis": {
    "totalStations": 276,
    "openStations": 273,
    "closedStations": 3,
    "totalBikesAvailable": 2145,
    "totalStandsAvailable": 3412,
    "criticalEmptyStations": 12,
    "criticalFullStations": 4
  },
  "stations": [ ... ]
}

```

---

## 👤 Autor

* **Desarrollador:** Yago Menéndez de la Vega Sepúlveda
* **Puesto:** IT Support Engineer | Operations
* **Entornos de Desarrollo:** JCDecaux España
