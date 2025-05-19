# FrontTracker – Client React

Este es el cliente web responsive de **FrontTracker**, creado con **React + Vite**.

## 🚀 Tecnologías usadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- CSS (puede cambiar según el framework de estilos que uséis)

## 📦 Instalación del proyecto

```bash
git clone https://github.com/mi-organizacion/fronttracker.git
cd fronttracker
npm install
npm run dev
```

## 🔐 Autenticación

La autenticación se realiza mediante **API Keys**.  
El usuario se selecciona desde un desplegable en la pantalla principal y su **API Key** se utiliza en cada petición al backend.

> ⚠️ Las API Keys están **hardcodeadas** en el código del cliente por simplicidad, como se indica en los requisitos del proyecto.

## 🔗 Backend

Este frontend se conecta al backend desarrollado con Django REST Framework.  
Puedes ver el código del backend en este repositorio:  
👉 [BackTracker](https://github.com/it11d-Issue-Tracker/BackTracker.git)

## 🌍 Despliegue

(⬜ Aquí se indicará la URL si el proyecto es desplegado en servicios como Vercel, Netlify, Render, etc.)

## 👥 Autores

- Samuel (2amu)
- Shence (@usuarioGitHub)
- Marti (@usuarioGitHub)
- Daniel 

## 🗂️ Estructura del proyecto

```bash
fronttracker/
├── public/             # Archivos públicos
├── src/
│   ├── components/     # Componentes React
│   ├── api/            # Funciones de conexión con la API REST
│   ├── App.jsx         # Componente principal
│   └── main.jsx        # Entrada de la app
├── index.html
├── package.json
├── vite.config.js
└── README.md
```