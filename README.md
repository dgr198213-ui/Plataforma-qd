# 🚀 Howard OS - Plataforma de Desarrollo Avanzada

**Howard OS** es un entorno de desarrollo integrado (IDE) modular y profesional construido con React, Vite y Tailwind CSS. Esta versión incluye una refactorización profunda de la arquitectura técnica y nuevas herramientas de productividad diseñadas para ingenieros de software.

---

## 📋 Tabla de Contenidos

- [Arquitectura Técnica (Refactorizada)](#-arquitectura-técnica-refactorizada)
- [Características Principales](#-características-principales)
- [Módulos Disponibles](#-módulos-disponibles)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación Rápida (Recomendado)](#-instalación-rápida-recomendado)
- [Instalación Manual](#-instalación-manual)
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

## 🚀 Instalación Rápida (Recomendado)

Para una configuración automática que genera claves de cifrado y estructura de directorios:

```bash
git clone https://github.com/dgr198213-ui/Plataforma-qd.git
cd Plataforma-qd
npm install
npm run setup
npm run dev
```

O usa el comando de inicio rápido:
```bash
npm run dev:quick
```

---

## 🛠️ Instalación Manual

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
├── scripts/
│   ├── setup.cjs            # Script de configuración automática
│   └── import-credentials.cjs # Script de importación
├── src/
│   ├── components/
│   │   ├── modules/
│   │   │   ├── credentials/
│   │   │   │   └── components/
│   │   │   │       └── AutoCredentialManager.jsx # Nuevo asistente visual
│   │   │   ├── development/
│   │   │   │   ├── CodeEditor/
│   │   │   │   │   └── ...
│   ├── store/
│   │   ├── codeStore.js
│   │   └── credentialsStore.js
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

---

## ☁️ Integración con Supabase

Howard OS ahora soporta persistencia real en la nube mediante **Supabase**.

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
