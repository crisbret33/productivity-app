const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const protect = asyncHandler(async (req, res, next) => {
    let token;

    // 1. Verificar si hay un token en el header (Formato: "Bearer <token>")
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener el token del header (quitando la palabra "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // Verificar el token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Obtener el usuario del token y guardarlo en req.user (sin el password)
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Continuar a la siguiente función (el controlador)
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('No autorizado, token fallido');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('No autorizado, no hay token');
    }
});

module.exports = { protect };