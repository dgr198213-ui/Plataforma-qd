# 🚀 Howard OS - Plataforma de Desarrollo Avanzada (Auditoría 2026)

<div align="center">

![Howard OS](https://img.shields.io/badge/Howard%20OS-v1.0.0-13ecc8?style=for-the-badge&logo=react&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tests Passed](https://img.shields.io/badge/Tests-31%20Passed-brightgreen?style=for-the-badge&logo=vitest&logoColor=white)

**IDE modular y profesional construido con React, Vite y Tailwind CSS.**  
Ahora como **Progressive Web App (PWA)** instalable en móviles y desktop.

</div>

---

## 📋 Resumen de la Auditoría del Sistema

Este repositorio, denominado **Howard OS**, es una plataforma de desarrollo avanzada que funciona como un **IDE (Entorno de Desarrollo Integrado) basado en navegador** [1]. La arquitectura es modular, centrada en React con gestión de estado a través de **Zustand** y persistencia opcional en la nube mediante **Supabase** [2].

La auditoría completa del sistema confirma que el proyecto está **operativo y funcional** en sus módulos principales, con una clara orientación hacia la **automatización de tareas de desarrollo asistida por Inteligencia Artificial (IA)**.

### Lógica y Pretensiones del Proyecto

La lógica central del proyecto es crear un **entorno de desarrollo unificado y seguro** que integre herramientas de codificación, gestión de proyectos, control de versiones (Git simplificado) y, crucialmente, **agentes de IA** para tareas complejas.

| Pretensión | Módulo Clave | Estado de Implementación |
| :--- | :--- | :--- |
| **Desarrollo Asistido por IA** | No-Code Chat, AI Task Runner | **Funcional**. Utiliza la API de Claude (Anthropic) para generar código y ejecutar tareas [3]. |
| **Automatización de Tareas** | Moltbot Gateway | **Funcional**. Implementa un cliente WebSocket (`ClawdbotGateway.js`) para orquestar tareas de IA de alto riesgo con un sistema de aprobación humana [4]. |
| **Seguridad de Credenciales** | Credenciales, SecureStorage | **Funcional**. Utiliza cifrado **AES-256** para almacenar credenciales localmente, con la opción de sincronización cifrada a Supabase [5]. |
| **Auditoría y Análisis** | Bias Firewall, Hype Detector, SolveIt | **Interfaces Activas**. Los módulos de análisis (Bias Firewall, Hype Detector, SolveIt Iterator) tienen interfaces de usuario bien definidas, aunque su lógica de negocio parece ser un *mock* o requiere integración con servicios externos para ser completamente funcionales [6]. |
| **Entorno de Desarrollo Completo** | Code Editor | **Funcional**. Integra **Monaco Editor** (motor de VS Code) con terminal, vista previa en vivo y panel Git. |

---

## ✨ Características Principales

| Feature | Descripción |
| :--- | :--- |
| 💻 **IDE Completo** | Editor Monaco (motor de VS Code) con Live Preview, Terminal y Diff Viewer. |
| 🤖 **IA Integrada** | **No-Code Chat** (Generación de código por conversación) y **AI Task Runner** (Automatización de tareas complejas). |
| 🛡️ **Moltbot Gateway** | Cliente WebSocket para orquestación de tareas de IA con gestión de riesgo y aprobación de operaciones críticas. |
| 🔐 **Cifrado AES-256** | Almacenamiento seguro de credenciales con clave de cifrado configurable. |
| ☁️ **Sincronización Cloud** | Persistencia de proyectos y archivos en **Supabase** (opcional). |
| 🔌 **Conectores** | Arquitectura modular para integrar servicios externos (GitHub, REST API, Webhooks). |
| 🧪 **Tests Unitarios** | 31 tests unitarios pasan, confirmando la estabilidad de la lógica de `ClawdbotGateway` y componentes clave. |

---

## 📂 Estructura Detallada del Proyecto y Funcionalidades

La siguiente estructura muestra la organización del código, destacando las funciones principales de los archivos clave:

```
Plataforma-qd/
├── config/
│   └── default-credentials.json   # Credenciales de ejemplo para el setup inicial.
├── public/
│   ├── icons/                     # Iconos PWA.
│   └── manifest.json              # Configuración de la Progressive Web App (PWA).
├── scripts/
│   ├── import-credentials.cjs     # Script para importar credenciales al sistema.
│   └── setup.cjs                  # Script de configuración inicial del proyecto.
├── src/
│   ├── App.jsx                    # Componente principal. Define el enrutamiento de módulos (setCurrentModule).
│   ├── main.jsx                   # Punto de entrada de React.
│   ├── index.css                  # Estilos globales (Tailwind CSS).
│   ├── constants/
│   │   └── modules.js             # Definición de constantes de módulos (MODULES).
│   ├── core/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx  # Manejo de errores de la aplicación.
│   │   │   └── LoadingScreen.jsx  # Pantalla de carga.
│   │   └── hooks/
│   │       └── useDocumentTitle.js# Hook para actualizar el título del documento.
│   ├── lib/
│   │   └── supabase.js            # Cliente de Supabase.
│   ├── services/
│   │   ├── ClawdbotGateway.js     # Cliente WebSocket para Moltbot.
│   │   │   └── Funciones clave: connect(), sendTask(), assessRisk(), handleApprovalRequest().
│   │   └── SecureStorage.js       # Servicio de cifrado AES-256.
│   │       └── Funciones clave: encrypt(), decrypt(), save(), load().
│   ├── store/                     # Gestión de estado (Zustand).
│   │   ├── authStore.js           # Estado de autenticación.
│   │   │   └── Funciones clave: initialize(), signIn(), signOut().
│   │   ├── codeStore.js           # Estado del IDE (archivos, terminal, Git).
│   │   │   └── Funciones clave: updateFileContent(), saveFile(), commitChanges(), fetchProjects().
│   │   └── credentialsStore.js    # Estado de credenciales.
│   │       └── Funciones clave: loadCredentials(), updateCredential(), addCredential(), getCredentialValue().
│   ├── utils/
│   │   ├── logger.js              # Utilidad de logging.
│   │   └── uuid.js                # Utilidad para generar/validar UUIDs.
│   └── components/
│       ├── shared/                # Componentes reutilizables.
│       │   ├── Dashboard.jsx      # Vista principal y selector de módulos.
│       │   ├── BottomNav.jsx      # Barra de navegación inferior.
│       │   ├── Login.jsx          # Componente de login/registro.
│       │   └── SystemHealth.jsx   # Monitoreo de la salud del sistema (Supabase, Cifrado, Store).
│       └── modules/               # Módulos principales de la aplicación.
│           ├── analysis/          # Módulos de análisis (Interfaces Mock).
│           │   ├── BiasFirewall.jsx
│           │   ├── HypeDetector.jsx
│           │   └── SolveItIterator.jsx
│           ├── credentials/
│           │   └── CredentialsPanel.jsx # Interfaz para gestionar credenciales.
│           ├── development/       # Módulos de desarrollo.
│           │   ├── CodeEditor/    # IDE completo (Monaco Editor).
│           │   ├── Connectors/    # Gestión de integraciones externas (GitHub, Supabase, Webhook).
│           │   ├── NoCodeChat/    # Chat de generación de código con IA (Claude).
│           │   │   └── Funciones clave: handleSend() - llama a la API de Anthropic con contexto del proyecto.
│           │   ├── AITaskRunner.jsx # Ejecutor de tareas de IA predefinidas (usa Claude API).
│           │   └── MoltbotPanel.jsx # Interfaz para Moltbot Gateway (muestra tareas y aprobaciones).
│           └── projects/
│               └── ProjectsManager.jsx # Gestión de proyectos y archivos.
├── supabase/
│   └── schema.sql                 # Esquema de la base de datos Supabase.
├── package.json                   # Dependencias y scripts (dev:full, test, setup).
└── README.md
```

---

## 🛠️ Arquitectura Técnica y Consistencia

### Estructura de Módulos

El proyecto sigue una estructura modular clara, lo que facilita la escalabilidad y el mantenimiento:

- `src/components/modules/development/`: Contiene el núcleo del IDE (`CodeEditor`), la automatización (`MoltbotPanel`, `AITaskRunner`) y la generación de código por IA (`NoCodeChat`).
- `src/components/modules/analysis/`: Contiene los módulos de análisis y auditoría (`BiasFirewall`, `HypeDetector`, `SolveItIterator`).
- `src/store/`: Gestión de estado centralizada con **Zustand** para autenticación, código y credenciales.
- `src/services/`: Servicios de bajo nivel como el cifrado (`SecureStorage.js`) y la comunicación con el agente (`ClawdbotGateway.js`).

### Seguridad y Observaciones Críticas

Se identificaron dos puntos de seguridad críticos que deben ser abordados:

1.  **Uso de `eval()`**: El `CodeEditor` utiliza `eval()` para la ejecución de código en el navegador. Esto es un riesgo de seguridad inherente para un IDE, aunque es necesario para la funcionalidad de "ejecución en vivo" [1].
2.  **Clave de Cifrado**: El sistema de cifrado de credenciales (`SecureStorage.js`) utiliza una clave por defecto insegura si la variable de entorno `VITE_ENCRYPTION_KEY` no está configurada. **Se recomienda encarecidamente** configurar una clave única y robusta en el entorno de producción [5].

### Consistencia Funcional

Las pruebas unitarias confirman la lógica de:
- **ClawdbotGateway**: Conexión, envío de tareas, gestión de estadísticas y el flujo de aprobación/rechazo de tareas de alto riesgo.
- **Componentes**: El componente `CodeEditor` se renderiza correctamente.

El proyecto es **consistente** con sus pretensiones, proporcionando una base sólida para un IDE asistido por IA. La integración con **Moltbot Gateway** y **AI Task Runner** (usando Claude 3.5 Sonnet) es la principal propuesta de valor, permitiendo la orquestación de tareas de desarrollo complejas.

---

## 🚀 Instalación Rápida

```bash
# Clonar el repositorio
git clone https://github.com/dgr198213-ui/Plataforma-qd.git
cd Plataforma-qd

# Instalar dependencias
npm install

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

## ☁️ Integración con Supabase

Howard OS soporta persistencia real en la nube mediante **Supabase** para proyectos y autenticación.

### Configuración Necesaria

Para habilitar la sincronización, añade las siguientes variables a tu archivo `.env`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
VITE_ENCRYPTION_KEY=tu_clave_secreta_unica_y_robusta
```

---

Desarrollado con ❤️ para la comunidad de ingeniería de Howard OS.
Licencia privada para **dgr198213-ui**.

---

## 📚 Referencias

[1] Jules (AI Engineer). *Reporte de Auditoría de Sistema Completo - Howard OS*. SYSTEM_AUDIT.md.
[2] `src/store/codeStore.js`. Persistencia de estado con Zustand y Supabase.
[3] `src/components/modules/development/NoCodeChat/ChatInterface.jsx`. Implementación de la API de Anthropic (Claude 3.5 Sonnet).
[4] `src/services/ClawdbotGateway.js`. Cliente WebSocket para la orquestación de tareas de IA.
[5] `src/services/SecureStorage.js`. Implementación de cifrado AES-256 para credenciales.
[6] `src/components/modules/analysis/BiasFirewall.jsx`, `HypeDetector.jsx`, `SolveItIterator.jsx`. Interfaces de usuario para módulos de análisis.
