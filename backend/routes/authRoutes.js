const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');

// POST a /api/auth/register
router.post('/register', registerUser);

// POST a /api/auth/login
router.post('/login', loginUser);

module.exports = router;