# 🚀 Howard OS - Plataforma de Desarrollo Avanzada (v2.0 - Contextual)

<div align="center">

![Howard OS](https://img.shields.io/badge/Howard%20OS-v2.0.0-13ecc8?style=for-the-badge&logo=react&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tests Passed](https://img.shields.io/badge/Tests-31%20Passed-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)

**IDE modular y profesional construido con React, Vite y Tailwind CSS.**  
Ahora con **Context Memory Engine (CME)** para una IA más inteligente y contextual.

</div>

---

## 🔗 Ecosistema QodeIA
**Howard OS** es el núcleo de desarrollo del ecosistema **QodeIA**, interconectado con:
*   **[Mi-agente-QodeIA-](https://github.com/dgr198213-ui/Mi-agente-QodeIA-)**: El cerebro autónomo que potencia el *AI Task Runner* y el chat de la plataforma, permitiendo la automatización de tareas sobre el código base.
*   **[Web-QodeIA-](https://github.com/dgr198213-ui/Web-QodeIA-)**: El portal central de la comunidad y administración, que provee la infraestructura de conocimiento y el panel MCP para el entrenamiento del sistema.

---

## 🧠 Integración del Sistema Howard OS (Context Memory Engine)

Esta actualización marca la integración del **Context Memory Engine (CME)**, un sistema de gestión de contexto de proyecto inspirado en la arquitectura **Lightning Attention**. El CME proporciona una representación completa y optimizada del código base a los agentes de IA, eliminando la necesidad de RAG (Retrieval-Augmented Generation) y mejorando drásticamente la calidad y relevancia de las respuestas.

### Características Clave del Context Memory Engine (CME)

| Característica | Descripción | Beneficio |
| :--- | :--- | :--- |
| **Atención Lineal (O(N))** | Simulación de la arquitectura Lightning Attention para procesar el contexto del proyecto en tiempo lineal. | **Velocidad y Escalabilidad**. Permite manejar proyectos de gran tamaño sin el cuello de botella de la atención cuadrática. |
| **Context Compression** | Reduce el tamaño del contexto en un 70% manteniendo la información clave. | **Eficiencia**. Optimiza el uso de tokens y la velocidad de consulta a la IA. |
| **Índice Semántico** | Crea un índice de búsqueda rápida (O(1)) basado en nombres de archivos e imports/exports. | **Precisión**. Recuperación instantánea de archivos relevantes para la IA. |
| **Sincronización Incremental** | El CME se actualiza automáticamente cuando se guarda un archivo en el Code Editor. | **Tiempo Real**. La IA siempre trabaja con la versión más reciente del código. |
| **Integración MCP** | Sincronización automática de soluciones validadas con NotebookLM. | **Base de Conocimiento**. El conocimiento del sistema crece con cada interacción. |

---

## ✨ Características Principales (Actualizadas)

| Feature | Descripción |
| :--- | :--- |
| 💻 **IDE Completo** | Editor Monaco (motor de VS Code) con Live Preview, Terminal y Diff Viewer. |
| 🤖 **IA Contextual** | **No-Code Chat** y **AI Task Runner** utilizan el CME para generar código con conocimiento profundo del proyecto. |
| 🧠 **Context Memory Engine** | Nuevo módulo para la gestión de contexto de proyecto de alto rendimiento. |
| 📊 **Memory Visualizer** | Módulo de interfaz para monitorizar el estado de la memoria (tokens, archivos, proyectos activos). |
| 🛡️ **Moltbot Gateway** | Orquestación de tareas de IA con gestión de riesgo y aprobación de operaciones críticas. |
| 🔐 **Cifrado AES-256** | Almacenamiento seguro de credenciales con clave de cifrado configurable. |
| ☁️ **Sincronización Cloud** | Persistencia de proyectos y archivos en **Supabase**. |

---

## 📂 Estructura Detallada del Proyecto (Actualizada)

```
Plataforma-qd/
├── src/
│   ├── services/
│   │   ├── ContextMemoryEngine.js   # Motor principal de atención contextual.
│   │   └── ClawdbotGateway.js       # Conexión con el agente QodeIA.
│   ├── hooks/
│   │   ├── useProjectMemory.js      # Hook para interactuar con el CME.
│   │   └── mcp-sync.ts              # Sincronización con la base de conocimiento.
│   ├── components/modules/development/
│   │   ├── CodeEditor/              # Sincroniza cambios con CME.
│   │   ├── NoCodeChat/              # Chat que consume el contexto del CME.
│   │   └── AITaskRunner.jsx         # Ejecutor de tareas potenciado por el Agente QodeIA.
```

---

## 🚀 Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/dgr198213-ui/Plataforma-qd.git
cd Plataforma-qd

# Instalar dependencias
pnpm install

# Configuración automática + iniciar
npm run dev:quick
```

La app estará disponible en: **http://localhost:5173**

---

## 📚 Referencias

[1] Howard OS Team. *Context Memory Engine - Arquitectura de Atención Lineal*. Internal Documentation.
[2] Jules (AI Engineer). *Reporte de Auditoría de Sistema Completo*. SYSTEM_AUDIT.md.
[3] `src/services/ClawdbotGateway.js`. Orquestación con el Agente Autónomo QodeIA.

---

**Creado con 💛 para la comunidad QodeIA**
