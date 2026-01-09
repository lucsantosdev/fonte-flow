const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @route   POST /api/auth/login
 * @desc    Login de usuário
 * @access  Public
 */
router.post('/login', authController.login);

/**
 * @route   GET /api/auth/me
 * @desc    Obter dados do usuário autenticado
 * @access  Private
 */
router.get('/me', authenticateToken, authController.me);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout de usuário
 * @access  Private
 */
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
