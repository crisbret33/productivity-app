const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Función para conectar a MongoDB
const { notFound, errorHandler } = require('./middlewares/errorMiddleware'); // Middlewares de error

// 1. Cargar variables de entorno del archivo .env
dotenv.config(); 

// 2. Conectar a la base de datos
connectDB();

const app = express();

// 3. Middlewares Globales
app.use(cors()); // Permite peticiones cruzadas desde el frontend
app.use(express.json()); // Permite parsear el body de peticiones JSON

// Ruta de prueba (opcional)
app.get('/', (req, res) => {
    res.send('API de Productividad está corriendo...');
});

// 4. Definición de Rutas de la Aplicación
// Todas las rutas de autenticación comienzan con /api/auth
app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/boards', require('./routes/boardRoutes'));
// app.use('/api/boards', require('./routes/boardRoutes')); // Se añadirá más tarde

// 5. Middlewares de Errores (Deben ir después de las rutas)
app.use(notFound); // Maneja URLs no encontradas (404)
app.use(errorHandler); // Maneja errores lanzados en los controladores

// 6. Configuración del Puerto y Levantamiento del Servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Servidor corriendo en el puerto ${PORT}`));