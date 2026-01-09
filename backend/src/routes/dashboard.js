const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middlewares/auth');

// Todas as rotas de dashboard são protegidas
router.use(authenticateToken);

/**
 * @route   GET /api/dashboard
 * @desc    Obter dados do dashboard
 * @access  Private
 */
router.get('/', dashboardController.getDashboard);

/**
 * @route   GET /api/dashboard/stats
 * @desc    Obter estatísticas gerais
 * @access  Private
 */
router.get('/stats', dashboardController.getStats);

module.exports = router;
