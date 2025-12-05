# 🚀 Plataforma de Productividad

Una aplicación web Full-Stack para la gestión de tareas y proyectos, inspirada en Trello. Permite a los usuarios crear tableros, listas y gestionar su flujo de trabajo de manera visual.

## Tecnologías Usadas (Stack MERN)

* **Frontend:** React (Vite), React Router, Axios.
* **Backend:** Node.js, Express.
* **Base de Datos:** MongoDB (Atlas).
* **Autenticación:** JSON Web Tokens (JWT).
* **Estilos:** CSS Modules / Styled Components (en progreso).

## Funcionalidades Implementadas

* ✅ **Autenticación Completa:** Registro e Inicio de Sesión de usuarios seguros.
* ✅ **Protección de Rutas:** Middleware para proteger recursos privados.
* ✅ **Dashboard:** Vista general de los proyectos del usuario.
* ✅ **Gestión de Tableros:** Creación y visualización de tableros dinámicos.
* ✅ **Listas Dinámicas:** Capacidad de añadir columnas (listas) dentro de los tableros.
* ✅ **Conexión API:** Arquitectura RESTful conectando cliente y servidor.

## Instalación y Puesta en Marcha

Si quieres ejecutar este proyecto en local:

1.  **Clonar el repositorio:**
    ```bash
    git clone <TU_URL_DE_GITHUB>
    ```

2.  **Instalar dependencias:**
    Desde la raíz del proyecto, ejecutamos la instalación (que instalará también backend y frontend si está configurado, o hazlo manual):
    ```bash
    npm install
    cd backend && npm install
    cd ../frontend && npm install
    ```

3.  **Configurar Variables de Entorno:**
    Crea un archivo `.env` en la carpeta `backend` con las siguientes variables:
    ```env
    PORT=5001
    MONGO_URI=tu_cadena_de_conexion_mongodb
    JWT_SECRET=tu_palabra_secreta
    ```

4.  **Ejecutar el proyecto:**
    Desde la raíz:
    ```bash
    npm run dev
    ```
    Esto lanzará tanto el servidor (Backend) como el cliente (Frontend) simultáneamente.

