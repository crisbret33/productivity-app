const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); 
const { notFound, errorHandler } = require('./middlewares/errorMiddleware');

dotenv.config(); 

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('API de Productividad está corriendo...');
});

app.use('/api/auth', require('./routes/authRoutes')); 
app.use('/api/boards', require('./routes/boardRoutes'));

app.use(notFound); 
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Servidor corriendo en el puerto ${PORT}`));