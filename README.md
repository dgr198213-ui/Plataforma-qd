# 🚀 Plataforma Howard OS

**Plataforma Howard OS** es un entorno de desarrollo integrado (IDE) modular y completo construido con React, Vite y Tailwind CSS. Diseñado para ofrecer una experiencia de desarrollo moderna con herramientas avanzadas de análisis, gestión de proyectos y edición de código en tiempo real.

---

## 📋 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Módulos Disponibles](#-módulos-disponibles)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación Local](#-instalación-local)
- [Configuración](#-configuración)
- [Scripts Disponibles](#-scripts-disponibles)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Uso del IDE Modular](#-uso-del-ide-modular)
- [Troubleshooting](#-troubleshooting)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## ✨ Características Principales

- **IDE Modular Completo**: Editor de código con Monaco Editor (el mismo motor de VS Code)
- **Ejecución en Tiempo Real**: Ejecuta código JavaScript/JSX directamente en el navegador
- **Vista Previa en Vivo**: Visualiza cambios en tiempo real con LivePreview
- **Terminal Integrada**: Terminal funcional dentro del IDE
- **Panel Git**: Gestión de control de versiones integrada
- **Explorador de Archivos**: Navegación jerárquica de archivos y carpetas
- **Snippets**: Biblioteca de fragmentos de código reutilizables
- **Colaboración**: Panel de colaboración para trabajo en equipo
- **Command Palette**: Acceso rápido a comandos (Ctrl/Cmd + P)
- **Gestión de Credenciales**: Almacenamiento seguro con cifrado AES
- **Módulos de Análisis**: Bias Firewall, Hype Detector, SolveIt Iterator
- **Gestión de Proyectos**: Organización y administración de múltiples proyectos
- **Conectores**: Integración con servicios externos
- **No-Code Chat**: Interfaz conversacional sin código

---

## 🧩 Módulos Disponibles

### 🛠️ Desarrollo

#### **Code Editor (IDE Modular)**
Editor de código profesional con las siguientes características:

- **Monaco Editor**: Editor de código completo con resaltado de sintaxis, autocompletado y linting
- **File Explorer**: Explorador de archivos con búsqueda y gestión de archivos/carpetas
- **File Tabs**: Pestañas para múltiples archivos abiertos simultáneamente
- **Terminal**: Terminal integrada para ejecutar comandos y ver salidas
- **Live Preview**: Vista previa en tiempo real de HTML/CSS/JS
- **Git Panel**: Control de versiones con estado de archivos, commits y ramas
- **Collaboration Panel**: Herramientas para trabajo colaborativo en tiempo real
- **Snippets Panel**: Biblioteca de fragmentos de código predefinidos
- **Command Palette**: Paleta de comandos rápida (Ctrl/Cmd + P)
- **Status Bar**: Barra de estado con información del archivo actual
- **Header**: Barra superior con controles de ejecución, guardado y pantalla completa

#### **No-Code Chat**
Interfaz conversacional para desarrollo sin código.

#### **Connectors**
Gestión de conexiones con servicios y APIs externas.

### 📊 Análisis

#### **Bias Firewall**
Herramienta para detectar y mitigar sesgos en datos y algoritmos.

#### **Hype Detector**
Análisis de tendencias y detección de hype en tecnologías emergentes.

#### **SolveIt Iterator**
Iterador de soluciones para resolución de problemas complejos.

### 📁 Gestión

#### **Projects Manager**
Administración centralizada de proyectos con creación, edición y eliminación.

#### **Credentials Panel**
Almacenamiento seguro de credenciales con cifrado AES-256.

#### **Dashboard**
Panel principal con acceso rápido a todos los módulos.

---

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.2**: Biblioteca principal para UI
- **Vite 5.2**: Build tool ultrarrápido
- **Tailwind CSS 3.4**: Framework CSS utility-first
- **Zustand 5.0**: Gestión de estado global ligera y eficiente

### Editor y Herramientas
- **Monaco Editor 4.7**: Editor de código profesional (motor de VS Code)
- **Lucide React**: Iconos modernos y personalizables
- **Crypto-JS 4.2**: Cifrado y seguridad para credenciales

### Desarrollo
- **ESLint**: Linter para mantener código limpio
- **PostCSS + Autoprefixer**: Procesamiento de CSS
- **Vite Plugin React**: Soporte completo para React con Fast Refresh

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js**: versión 16.x o superior
- **npm**: versión 8.x o superior (incluido con Node.js)
- **Git**: para clonar el repositorio

Verifica las versiones instaladas:

```bash
node --version
npm --version
git --version
```

---

## 🚀 Instalación Local

### 1. Clonar el Repositorio

```bash
git clone https://github.com/dgr198213-ui/Plataforma-qd.git
cd Plataforma-qd
```

### 2. Instalar Dependencias

```bash
npm install
```

Este comando instalará todas las dependencias listadas en `package.json`, incluyendo:
- React y React DOM
- Vite y plugins
- Tailwind CSS y PostCSS
- Monaco Editor
- Zustand
- Lucide React
- Crypto-JS
- ESLint y configuraciones

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y configura tus variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` y configura la clave de cifrado:

```env
# Clave de cifrado (generar con: openssl rand -base64 32)
VITE_ENCRYPTION_KEY=tu-clave-secreta-aqui
```

**Generar una clave segura:**

```bash
openssl rand -base64 32
```

Copia el resultado y pégalo en `VITE_ENCRYPTION_KEY`.

### 4. Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: **http://localhost:5173**

---

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `VITE_ENCRYPTION_KEY` | Clave de cifrado AES-256 para credenciales | ✅ Sí |

### Configuración de Tailwind

El proyecto usa Tailwind CSS con configuración personalizada en `tailwind.config.js`. Los colores principales son:

- **Primary**: `#13ecc8` (verde cyan)
- **Background**: `#0d1117` (negro azulado oscuro)
- **Secondary Background**: `#192233` (azul oscuro)

### Configuración de Vite

El archivo `vite.config.js` incluye:
- Plugin de React con Fast Refresh
- Configuración de alias para imports
- Optimización de build

---

## 📜 Scripts Disponibles

### Desarrollo

```bash
npm run dev
```
Inicia el servidor de desarrollo con hot-reload en `http://localhost:5173`.

### Build de Producción

```bash
npm run build
```
Genera una versión optimizada para producción en la carpeta `dist/`.

### Vista Previa de Producción

```bash
npm run preview
```
Previsualiza el build de producción localmente.

### Linting

```bash
npm run lint
```
Ejecuta ESLint para verificar la calidad del código y detectar errores.

---

## 📂 Estructura del Proyecto

```
Plataforma-qd/
├── public/                      # Archivos estáticos
├── src/
│   ├── components/
│   │   ├── modules/
│   │   │   ├── analysis/        # Módulos de análisis
│   │   │   │   ├── BiasFirewall.jsx
│   │   │   │   ├── HypeDetector.jsx
│   │   │   │   └── SolveItIterator.jsx
│   │   │   ├── credentials/     # Gestión de credenciales
│   │   │   │   └── CredentialsPanel.jsx
│   │   │   ├── development/     # Módulos de desarrollo
│   │   │   │   ├── CodeEditor/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── CollaborationPanel.jsx
│   │   │   │   │   │   ├── CommandPalette.jsx
│   │   │   │   │   │   ├── FileExplorer.jsx
│   │   │   │   │   │   ├── FileTabs.jsx
│   │   │   │   │   │   ├── GitPanel.jsx
│   │   │   │   │   │   ├── Header.jsx
│   │   │   │   │   │   ├── LivePreview.jsx
│   │   │   │   │   │   ├── MonacoEditor.jsx
│   │   │   │   │   │   ├── SnippetsPanel.jsx
│   │   │   │   │   │   ├── StatusBar.jsx
│   │   │   │   │   │   ├── Terminal.jsx
│   │   │   │   │   │   └── index.js
│   │   │   │   │   └── index.jsx
│   │   │   │   ├── Connectors.jsx
│   │   │   │   └── NoCodeChat.jsx
│   │   │   └── projects/        # Gestión de proyectos
│   │   │       └── ProjectsManager.jsx
│   │   └── shared/              # Componentes compartidos
│   │       ├── BottomNav.jsx
│   │       └── Dashboard.jsx
│   ├── constants/
│   │   └── modules.js           # Definición de módulos
│   ├── core/
│   │   ├── components/
│   │   │   ├── ErrorBoundary.jsx
│   │   │   └── LoadingScreen.jsx
│   │   └── hooks/
│   │       └── useDocumentTitle.js
│   ├── services/
│   │   └── SecureStorage.js     # Servicio de almacenamiento seguro
│   ├── store/
│   │   ├── codeStore.js         # Store de Zustand para Code Editor
│   │   └── credentialsStore.js  # Store de Zustand para Credenciales
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Punto de entrada
├── .env.example                 # Ejemplo de variables de entorno
├── .gitignore
├── eslint.config.js             # Configuración de ESLint
├── index.html                   # HTML principal
├── package.json                 # Dependencias y scripts
├── postcss.config.js            # Configuración de PostCSS
├── README.md                    # Este archivo
├── tailwind.config.js           # Configuración de Tailwind CSS
└── vite.config.js               # Configuración de Vite
```

---

## 💻 Uso del IDE Modular

### Acceso al Code Editor

1. Abre la aplicación en tu navegador
2. Desde el Dashboard, haz clic en **"Code Editor"**
3. El IDE se abrirá con todos los paneles disponibles

### Componentes del IDE

#### **File Explorer (Panel Izquierdo)**
- **Búsqueda**: Filtra archivos por nombre
- **Crear Archivo**: Botón "ARCHIVO" en la parte inferior
- **Crear Carpeta**: Botón "CARPETA" en la parte inferior
- **Navegación**: Clic en archivos para abrirlos

#### **Editor Central (Monaco Editor)**
- **Resaltado de Sintaxis**: Soporte para JavaScript, JSX, TypeScript, HTML, CSS, JSON
- **Autocompletado**: IntelliSense integrado
- **Atajos de Teclado**: Atajos estándar de VS Code
- **Múltiples Pestañas**: Gestión de múltiples archivos abiertos

#### **Terminal (Panel Inferior)**
- **Salida de Ejecución**: Muestra resultados de código ejecutado
- **Logs**: Captura console.log y errores
- **Comandos**: Interfaz para ejecutar comandos

#### **Live Preview (Panel Derecho Superior)**
- **Vista en Tiempo Real**: Previsualización automática de HTML/CSS/JS
- **Iframe Aislado**: Ejecución segura de código

#### **Paneles Laterales Derechos**
- **Git Panel**: Estado de archivos, commits, ramas
- **Collaboration Panel**: Herramientas de colaboración
- **Snippets Panel**: Biblioteca de fragmentos de código

#### **Header (Barra Superior)**
- **Botón Run**: Ejecuta el archivo actual (JavaScript/JSX)
- **Botón Save**: Guarda el archivo actual (Ctrl/Cmd + S)
- **Pantalla Completa**: Maximiza el IDE
- **Botón Volver**: Regresa al Dashboard

#### **Status Bar (Barra Inferior)**
- **Información del Archivo**: Nombre, lenguaje, líneas
- **Estado de Git**: Rama actual, cambios pendientes
- **Posición del Cursor**: Línea y columna actual

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Ctrl/Cmd + P` | Abrir Command Palette |
| `Ctrl/Cmd + S` | Guardar archivo actual |
| `Esc` | Cerrar Command Palette |
| `Ctrl/Cmd + Enter` | Ejecutar código |

### Ejecutar Código

1. Abre o crea un archivo JavaScript/JSX
2. Escribe tu código
3. Haz clic en el botón **"Run"** en el header
4. La salida aparecerá en la Terminal

**Ejemplo:**

```javascript
console.log("¡Hola, Howard OS!");

const suma = (a, b) => a + b;
console.log("2 + 3 =", suma(2, 3));
```

### Gestión de Credenciales

1. Accede al módulo **"Credentials Panel"**
2. Añade credenciales con nombre, usuario y contraseña
3. Las credenciales se cifran automáticamente con AES-256
4. Usa las credenciales en tus proyectos de forma segura

---

## 🔧 Troubleshooting

### Problema: El servidor no inicia

**Solución:**
```bash
# Limpia node_modules y reinstala
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Problema: Error de "VITE_ENCRYPTION_KEY not defined"

**Solución:**
```bash
# Asegúrate de tener el archivo .env configurado
cp .env.example .env
# Edita .env y añade una clave generada con:
openssl rand -base64 32
```

### Problema: Monaco Editor no carga

**Solución:**
```bash
# Reinstala la dependencia de Monaco Editor
npm uninstall @monaco-editor/react
npm install @monaco-editor/react@^4.7.0
```

### Problema: Estilos de Tailwind no se aplican

**Solución:**
```bash
# Regenera los estilos de Tailwind
npm run build
# O reinicia el servidor de desarrollo
npm run dev
```

### Problema: Error de ESLint

**Solución:**
```bash
# Ejecuta el linter y revisa los errores
npm run lint
# Para autofix de errores menores:
npm run lint -- --fix
```

### Problema: Build falla en producción

**Solución:**
```bash
# Limpia la carpeta dist y rebuilds
rm -rf dist
npm run build
```

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Si deseas contribuir:

1. **Fork** el repositorio
2. Crea una **rama** para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -m 'Añade nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Guías de Contribución

- Sigue las convenciones de código existentes
- Escribe commits descriptivos en español
- Añade tests si es posible
- Actualiza la documentación si es necesario
- Usa ESLint para mantener la calidad del código

---

## 📄 Licencia

Este proyecto es privado y pertenece a **dgr198213-ui**. Todos los derechos reservados.

---

## 📞 Contacto y Soporte

Para preguntas, sugerencias o reportar problemas:

- **GitHub Issues**: [Plataforma-qd/issues](https://github.com/dgr198213-ui/Plataforma-qd/issues)
- **Repository**: [Plataforma-qd](https://github.com/dgr198213-ui/Plataforma-qd)

---

## 🎯 Roadmap

### Próximas Funcionalidades

- [ ] Soporte para más lenguajes de programación
- [ ] Integración con GitHub Actions
- [ ] Terminal con ejecución de comandos reales
- [ ] Modo oscuro/claro personalizable
- [ ] Extensiones y plugins
- [ ] Colaboración en tiempo real con WebSockets
- [ ] Debugger integrado
- [ ] Tests unitarios y de integración
- [ ] Documentación interactiva
- [ ] Exportación de proyectos completos

---

## 🌟 Agradecimientos

Gracias a todos los contribuidores y a las siguientes tecnologías que hacen posible este proyecto:

- React Team
- Vite Team
- Tailwind CSS Team
- Monaco Editor (Microsoft)
- Zustand Team
- Lucide Icons

---

**Desarrollado con ❤️ por el equipo de Howard OS**

---

## 📊 Estado del Proyecto

![Status](https://img.shields.io/badge/status-active-success.svg)
![Version](https://img.shields.io/badge/version-0.0.0-blue.svg)
![License](https://img.shields.io/badge/license-private-red.svg)

**Última actualización**: Enero 2025
