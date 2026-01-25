# 🚀 Howard OS - Plataforma de Desarrollo Avanzada

**Howard OS** es un entorno de desarrollo integrado (IDE) modular y profesional construido con React, Vite y Tailwind CSS. Esta versión incluye una refactorización profunda de la arquitectura técnica y nuevas herramientas de productividad diseñadas para ingenieros de software.

---

## 📋 Tabla de Contenidos

- [Arquitectura Técnica (Refactorizada)](#-arquitectura-técnica-refactorizada)
- [Características Principales](#-características-principales)
- [Módulos Disponibles](#-módulos-disponibles)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación Local](#-instalación-local)
- [Atajos de Teclado](#-atajos-de-teclado)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap](#-roadmap)

---

## 🛠️ Arquitectura Técnica (Refactorizada)

### Gestión de Estado con Zustand + Immer
El sistema utiliza **Zustand** para la gestión de estado global, optimizado con:
- **Immer Middleware**: Permite mutaciones de estado inmutables de forma sencilla y legible.
- **Devtools**: Integración completa con Redux DevTools para depuración en tiempo real.
- **Persistencia Selectiva**: Sincronización automática de archivos y configuraciones con `localStorage`.

### Editor de Código Profesional
Basado en **Monaco Editor**, ahora potenciado con herramientas personalizadas:
- **Command Palette (Ctrl+P)**: Acceso rápido a comandos del sistema y búsqueda de archivos.
- **Búsqueda Global (Ctrl+Shift+F)**: Motor de búsqueda indexado en todos los archivos del proyecto.
- **Diff Viewer**: Comparador de cambios en tiempo real para visualizar modificaciones antes de guardar.
- **Minimap Personalizado**: Navegación visual rápida a través del código fuente.
- **Terminal Integrada**: Salida de ejecución y logs del sistema.

---

## ✨ Características Principales

- **IDE Modular Completo**: Editor de código con Monaco Editor (motor de VS Code).
- **Ejecución en Tiempo Real**: Ejecuta código JavaScript/JSX directamente en el navegador.
- **Vista Previa en Vivo**: Visualiza cambios en tiempo real con LivePreview.
- **Panel Git**: Gestión de control de versiones integrada.
- **Gestión de Credenciales**: Almacenamiento seguro con cifrado AES-256.
- **Módulos de Análisis**: Bias Firewall, Hype Detector, SolveIt Iterator.

---

## 🧩 Módulos Disponibles

### 🛠️ Desarrollo
- **IDE Modular**: Editor multiactivo con gestión de pestañas, explorador de archivos y herramientas Git.
- **No-Code Chat**: Interfaz de asistencia para generación de lógica sin código.
- **Connectors**: Gestión de integraciones externas y APIs.

### 📊 Análisis y Seguridad
- **Bias Firewall**: Detección y mitigación de sesgos en el desarrollo.
- **Hype Detector**: Análisis de tendencias y relevancia tecnológica.
- **SolveIt Iterator**: Herramienta de resolución de problemas paso a paso.

### 🔐 Gestión
- **Projects Manager**: Organización de múltiples proyectos y espacios de trabajo.
- **Credentials Panel**: Almacenamiento seguro de claves API con cifrado AES-256.

---

## 🛠️ Tecnologías Utilizadas

- **React 18.2** + **Vite 5.2**
- **Tailwind CSS 3.4**
- **Zustand 5.0** (con Immer y Persist)
- **Monaco Editor 4.7**
- **Lucide React** (Iconografía)
- **Diff** (Motor de comparación de archivos)
- **Crypto-JS 4.2** (Seguridad)

---

## 🚀 Instalación Local

### 1. Clonar y Preparar
```bash
git clone https://github.com/dgr198213-ui/Plataforma-qd.git
cd Plataforma-qd
npm install
```

### 2. Configurar Variables de Entorno
```bash
cp .env.example .env
# Generar clave de cifrado para seguridad local
openssl rand -base64 32
```

### 3. Ejecución
```bash
npm run dev
```
La aplicación estará disponible en: **http://localhost:5173**

---

## ⌨️ Atajos de Teclado (Nuevos)

| Atajo | Acción |
|-------|--------|
| `Ctrl + P` | Abrir Command Palette |
| `Ctrl + Shift + F` | Búsqueda Global |
| `Ctrl + S` | Guardar Archivo Actual |
| `Ctrl + J` | Alternar Terminal |
| `Esc` | Cerrar Modales / Paneles |

---

## 📂 Estructura del Proyecto

```
Plataforma-qd/
├── src/
│   ├── components/
│   │   ├── modules/
│   │   │   ├── development/
│   │   │   │   ├── CodeEditor/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CommandPalette.jsx
│   │   │   │   │   │   ├── GlobalSearch.jsx
│   │   │   │   │   │   ├── DiffViewer.jsx
│   │   │   │   │   │   ├── Minimap.jsx
│   │   │   │   │   │   └── ...
│   │   │   │   │   └── index.jsx
│   ├── store/
│   │   ├── codeStore.js         # Store optimizado con Immer
│   │   └── credentialsStore.js
│   ├── services/
│   │   └── SecureStorage.js
│   └── App.jsx
└── README.md
```

---

## 🎯 Roadmap

- [ ] **Backend Seguro**: Migración de lógica de cifrado a un servidor Node.js dedicado.
- [ ] **AI Assistant**: Integración nativa con Claude API para asistencia en código.
- [ ] **PWA**: Soporte completo para funcionamiento offline e instalación.
- [ ] **Colaboración**: Trabajo en tiempo real con WebSockets.

---
Desarrollado con ❤️ para la comunidad de ingeniería de Howard OS.
Licencia privada para **dgr198213-ui**.
