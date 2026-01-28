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

## 🧠 Integración del Sistema Howard OS (Context Memory Engine)

Esta actualización marca la integración del **Context Memory Engine (CME)**, un sistema de gestión de contexto de proyecto inspirado en la arquitectura **Lightning Attention** [1]. El CME proporciona una representación completa y optimizada del código base a los agentes de IA, eliminando la necesidad de RAG (Retrieval-Augmented Generation) y mejorando drásticamente la calidad y relevancia de las respuestas.

### Características Clave del Context Memory Engine (CME)

| Característica | Descripción | Beneficio |
| :--- | :--- | :--- |
| **Atención Lineal (O(N))** | Simulación de la arquitectura Lightning Attention para procesar el contexto del proyecto en tiempo lineal. | **Velocidad y Escalabilidad**. Permite manejar proyectos de gran tamaño sin el cuello de botella de la atención cuadrática (O(N²)). |
| **Context Compression** | Reduce el tamaño del contexto en un 70% (simulando Multi-Head Latent Attention) manteniendo la información clave. | **Eficiencia**. Optimiza el uso de tokens y la velocidad de consulta a la IA. |
| **Índice Semántico** | Crea un índice de búsqueda rápida (O(1)) basado en nombres de archivos, palabras clave e imports/exports. | **Precisión**. Permite a la IA recuperar archivos relevantes instantáneamente para consultas específicas. |
| **Sincronización Incremental** | El CME se actualiza automáticamente cuando se guarda un archivo en el Code Editor. | **Tiempo Real**. La IA siempre trabaja con la versión más reciente del código. |

---

## ✨ Características Principales (Actualizadas)

| Feature | Descripción |
| :--- | :--- |
| 💻 **IDE Completo** | Editor Monaco (motor de VS Code) con Live Preview, Terminal y Diff Viewer. |
| 🤖 **IA Contextual** | **No-Code Chat** y **AI Task Runner** ahora utilizan el **Context Memory Engine** para generar código y ejecutar tareas con conocimiento profundo del proyecto. |
| 🧠 **Context Memory Engine** | Nuevo módulo para la gestión de contexto de proyecto (ver tabla superior). |
| 📊 **Memory Visualizer** | Módulo de interfaz para monitorizar el estado de la memoria (tokens, archivos, proyectos activos). |
| 🛡️ **Moltbot Gateway** | Cliente WebSocket para orquestación de tareas de IA con gestión de riesgo y aprobación de operaciones críticas. |
| 🔐 **Cifrado AES-256** | Almacenamiento seguro de credenciales con clave de cifrado configurable. |
| ☁️ **Sincronización Cloud** | Persistencia de proyectos y archivos en **Supabase** (opcional). |

---

## 📂 Estructura Detallada del Proyecto y Funcionalidades (Actualizada)

La siguiente estructura muestra la organización del código, destacando las nuevas funciones del CME:

```
Plataforma-qd/
├── config/
├── public/
├── scripts/
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── index.css
│   ├── constants/
│   │   └── modules.js             # ACTUALIZADO: Incluye Context Memory Panel y Memory Visualizer.
│   ├── core/
│   ├── lib/
│   ├── services/
│   │   ├── ContextMemoryEngine.js   # NUEVO: Motor principal de atención contextual.
│   │   ├── ClawdbotGateway.js
│   │   └── SecureStorage.js
│   ├── hooks/
│   │   └── useProjectMemory.js      # NUEVO: Hook para interactuar con el CME.
│   ├── store/                     # Gestión de estado (Zustand).
│   │   ├── contextMemoryStore.js    # NUEVO: Store para el estado del CME.
│   │   ├── authStore.js
│   │   ├── codeStore.js
│   │   └── credentialsStore.js
│   ├── utils/
│   ├── components/
│   │   ├── shared/
│   │   └── modules/
│   │       ├── analysis/
│   │       ├── credentials/
│   │       ├── development/       # Módulos de desarrollo.
│   │       │   ├── CodeEditor/    # Code Editor (Ahora sincroniza cambios con CME).
│   │       │   ├── Connectors/
│   │       │   ├── NoCodeChat/    # Chat de IA (Ahora usa CME para contexto).
│   │       │   ├── AITaskRunner.jsx # Ejecutor de tareas (Ahora usa CME para contexto).
│   │       │   ├── ContextMemoryPanel.jsx # NUEVO: Interfaz de consulta al CME.
│   │       │   ├── MemoryVisualizer.jsx   # NUEVO: Interfaz de visualización de memoria.
│   │       │   └── MoltbotPanel.jsx
│   │       └── projects/
├── supabase/
├── package.json                   # Dependencias actualizadas.
└── README.md
```

---

## 🚀 Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/dgr198213-ui/Plataforma-qd.git
cd Plataforma-qd

# Instalar dependencias
pnpm install # Se recomienda pnpm para una instalación más rápida y eficiente

# Configuración automática + iniciar
npm run dev:quick
```

O paso a paso:

```bash
npm run setup    # Genera .env y estructura
npm run dev      # Inicia servidor de desarrollo
```

La app estará disponible en: **http://localhost:5173**

---

## 📚 Referencias

[1] Howard OS Team. *Context Memory Engine - Arquitectura de Atención Lineal*. Internal Documentation.
[2] Jules (AI Engineer). *Reporte de Auditoría de Sistema Completo - Howard OS*. SYSTEM_AUDIT.md.
[3] `src/components/modules/development/NoCodeChat/ChatInterface.jsx`. Implementación de la API de Anthropic (Claude 3.5 Sonnet).
[4] `src/services/SecureStorage.js`. Implementación de cifrado AES-256 para credenciales.
