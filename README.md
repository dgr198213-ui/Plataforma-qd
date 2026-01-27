# 🚀 Howard OS - Plataforma de Desarrollo Avanzada

<div align="center">

![Howard OS](https://img.shields.io/badge/Howard%20OS-v1.0.0-13ecc8?style=for-the-badge&logo=react&logoColor=white)
![PWA Ready](https://img.shields.io/badge/PWA-Ready-success?style=for-the-badge&logo=pwa&logoColor=white)
![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**IDE modular y profesional construido con React, Vite y Tailwind CSS.**  
Ahora como **Progressive Web App (PWA)** instalable en móviles y desktop.

</div>

---

## 📱 Instalación como App (PWA)

### Android (Chrome)
1. Abre la app en Chrome
2. Toca el banner "Instalar Howard OS" o ve a **⋮ → Instalar app**
3. Confirma la instalación

### iOS (Safari)
1. Abre la app en Safari
2. Toca el botón **Compartir** (⬆️)
3. Selecciona **"Añadir a pantalla de inicio"**
4. Toca **"Añadir"**

### Desktop (Chrome/Edge)
1. Abre la app en el navegador
2. Haz clic en el icono de instalación en la barra de direcciones
3. O usa el banner de instalación que aparece automáticamente

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Instalación Rápida](#-instalación-rápida)
- [Módulos Disponibles](#-módulos-disponibles)
- [Arquitectura Técnica](#-arquitectura-técnica)
- [Atajos de Teclado](#-atajos-de-teclado)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías)
- [PWA Features](#-pwa-features)

---

## ✨ Características Principales

| Feature | Descripción |
|---------|-------------|
| 📱 **PWA Instalable** | Funciona como app nativa en móvil y desktop |
| 🔌 **Funciona Offline** | Cache inteligente de archivos estáticos |
| 💻 **IDE Completo** | Editor Monaco (motor de VS Code) |
| 🔄 **Git Integrado** | Stage, commit, branches sin salir de la app |
| 🔐 **Cifrado AES-256** | Almacenamiento seguro de credenciales |
| ⚡ **Ejecución en Vivo** | Ejecuta JavaScript/JSX en el navegador |
| 🎨 **Vista Previa** | LivePreview con responsive modes |
| 🔍 **Búsqueda Global** | Busca en todos los archivos del proyecto |
| 📊 **System Health** | Monitoreo en tiempo real del sistema |

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

## 📦 Módulos Disponibles

### Desarrollo & Herramientas

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| 🔑 **Credenciales** | Gestiona APIs, tokens y accesos con cifrado AES-256 | ✅ Activo |
| 💻 **Editor de Código** | IDE completo con Monaco Editor + Terminal | ✅ Activo |
| 💬 **No-Code Chat** | Desarrollo por conversación con IA (Claude 3.5) | ✅ Activo |
| 🔗 **Conectores** | Integración con GitHub, APIs y webhooks | ✅ Activo |
| 📁 **Proyectos** | Gestión completa de archivos y proyectos | ✅ Activo |

### Análisis & Auditoría

| Módulo | Descripción | Estado |
|--------|-------------|--------|
| 🛡️ **Bias Firewall** | Auditoría de sesgos en tiempo real | 🔶 Mock |
| 📡 **Hype Detector** | Filtra ruido de señal en noticias | 🔶 Mock |
| ⚡ **SolveIt Iterator** | Gestión iterativa pragmática | 🔶 Mock |

---

## 🛠️ Arquitectura Técnica

### Gestión de Estado
```
Zustand + Immer + Persist
├── codeStore.js      → Archivos, Git, Terminal, Snippets
└── credentialsStore.js → APIs, Tokens (cifrado AES-256)
```

### Editor de Código
- **Monaco Editor** - Motor de VS Code
- **Command Palette** - Ctrl+P
- **Global Search** - Ctrl+Shift+F
- **Diff Viewer** - Comparador de cambios
- **Minimap** - Navegación visual
- **Terminal** - Salida de ejecución

### Sistema Git Local
- Stage/Unstage archivos
- Commits con mensaje
- Crear/cambiar branches
- Historial de commits

---

## ⌨️ Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl + P` | Command Palette |
| `Ctrl + Shift + F` | Búsqueda Global |
| `Ctrl + S` | Guardar archivo |
| `Escape` | Cerrar modal/panel |

---

## 📂 Estructura del Proyecto

```
Plataforma-qd/
├── public/
│   ├── manifest.json          # Configuración PWA
│   └── icons/                 # Iconos de la app
│       ├── icon.svg
│       └── icon-*.png
├── src/
│   ├── components/
│   │   ├── modules/
│   │   │   ├── analysis/      # Bias, Hype, SolveIt
│   │   │   ├── credentials/   # Gestión de credenciales
│   │   │   ├── development/   # CodeEditor, NoCodeChat
│   │   │   └── projects/      # Gestión de proyectos
│   │   └── shared/
│   │       ├── Dashboard.jsx
│   │       ├── BottomNav.jsx
│   │       ├── SystemHealth.jsx
│   │       └── PWAInstallPrompt.jsx
│   ├── store/
│   │   ├── codeStore.js       # Estado del editor
│   │   └── credentialsStore.js
│   ├── services/
│   │   └── SecureStorage.js   # Cifrado AES-256
│   └── App.jsx
├── scripts/
│   ├── setup.cjs
│   └── import-credentials.cjs
├── vite.config.js             # Configuración Vite + PWA
├── package.json
└── README.md
```

---

## 🔧 Tecnologías

| Categoría | Tecnología |
|-----------|------------|
| **Framework** | React 18.2 |
| **Build Tool** | Vite 5.2 |
| **Estilos** | Tailwind CSS 3.4 |
| **Estado** | Zustand 5 + Immer |
| **Editor** | Monaco Editor 4.7 |
| **Integraciones** | Octokit (GitHub API) |
| **Cifrado** | CryptoJS (AES-256) |
| **PWA** | vite-plugin-pwa + Workbox |
| **Testing** | Vitest + React Testing Library |
| **Iconos** | Lucide React |

---
Desarrollado con ❤️ para la comunidad de ingeniería de Howard OS.
Licencia privada para **dgr198213-ui**.

---

## ☁️ Integración con Supabase

Howard OS ahora soporta persistencia real en la nube mediante **Supabase**.

### 🤖 Desarrollo por Conversación (No-Code Chat)
El módulo **No-Code Chat** integra la potencia de **Claude 3.5 Sonnet** (Anthropic) directamente en tu flujo de trabajo:
- **Generación Contextual**: La IA conoce los archivos de tu proyecto y el framework que estás usando.
- **Vista Previa de Código**: Revisa el código generado antes de aplicarlo.
- **Integración Directa**: Aplica los cambios a cualquier archivo de tu proyecto con un solo clic.
- **Plantillas**: Atajos para crear formularios, integraciones de API y estados globales instantáneamente.

### 🔗 Sistema de Conectores
Gestiona integraciones externas de forma modular:
- **GitHub Connector**: Lista tus repositorios, clónalos directamente al IDE y publica tus cambios (push) con mensajes de commit personalizados.
- **Extensibilidad**: Arquitectura preparada para Webhooks, REST APIs y bases de datos externas.

### Configuración Necesaria
Para habilitar la sincronización, añade las siguientes variables a tu archivo `.env`:

```env
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_clave_anon_de_supabase
```

### Características de la Integración
- **Proyectos y Archivos**: Sincronización automática de tu espacio de trabajo.
- **Credenciales Híbridas**: Las credenciales se cifran localmente con AES-256 antes de subirse a Supabase, garantizando que solo tú puedas descifrarlas.
- **RLS (Row Level Security)**: Protección de datos a nivel de base de datos.
