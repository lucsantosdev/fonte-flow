const express = require('express');
const router = express.Router();
const retiradasController = require('../controllers/retiradasController');
const { authenticateToken } = require('../middlewares/auth');

// Todas as rotas de retiradas são protegidas
router.use(authenticateToken);

/**
 * @route   GET /api/retiradas
 * @desc    Listar retiradas
 * @access  Private
 */
router.get('/', retiradasController.listarRetiradas);

/**
 * @route   GET /api/retiradas/:id
 * @desc    Obter detalhes de uma retirada
 * @access  Private
 */
router.get('/:id', retiradasController.obterRetirada);

/**
 * @route   POST /api/retiradas
 * @desc    Registrar nova retirada
 * @access  Private
 */
router.post('/', retiradasController.registrarRetirada);

module.exports = router;
