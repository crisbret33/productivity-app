const asyncHandler = require('express-async-handler'); // Para manejar errores asíncronos sin bloques try/catch
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Importa el modelo de usuario

// --- Función Auxiliar: Generar JWT ---
const generateToken = (id) => {
    // Firma un nuevo token usando el ID del usuario y la clave secreta
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d', // El token expira en 30 días
    });
};

// @desc    Registrar un nuevo usuario
// @route   POST /api/auth/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // 1. Validar que se envíen todos los campos
    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Por favor, ingresa todos los campos: nombre, email y contraseña.');
    }

    // 2. Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('El usuario ya existe con este correo electrónico.');
    }

    // 3. Crear el nuevo usuario (el middleware 'pre-save' hashea la contraseña)
    const user = await User.create({
        name,
        email,
        password,
    });

    // 4. Si la creación fue exitosa, enviar respuesta
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id), // Genera y envía el token
        });
    } else {
        res.status(400);
        throw new Error('Datos de usuario no válidos.');
    }
});


// @desc    Autenticar un usuario (login)
// @route   POST /api/auth/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // 1. Buscar el usuario por email
    const user = await User.findOne({ email });

    // 2. Verificar si el usuario existe y si la contraseña es correcta
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        });
    } else {
        res.status(401); // 401 Unauthorized
        throw new Error('Email o contraseña incorrectos.');
    }
});


module.exports = {
    registerUser,
    loginUser,
};