const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');
const { authenticateToken } = require('../middlewares/auth');

// Todas as rotas de clientes são protegidas
router.use(authenticateToken);

/**
 * @route   GET /api/clientes
 * @desc    Listar todos os clientes
 * @access  Private
 */
router.get('/', clientesController.listarClientes);

/**
 * @route   GET /api/clientes/:id
 * @desc    Obter um cliente específico
 * @access  Private
 */
router.get('/:id', clientesController.obterCliente);

/**
 * @route   POST /api/clientes
 * @desc    Cadastrar novo cliente
 * @access  Private
 */
router.post('/', clientesController.cadastrarCliente);

/**
 * @route   PUT /api/clientes/:id
 * @desc    Atualizar cliente
 * @access  Private
 */
router.put('/:id', clientesController.atualizarCliente);

/**
 * @route   DELETE /api/clientes/:id
 * @desc    Desativar cliente
 * @access  Private
 */
router.delete('/:id', clientesController.desativarCliente);

module.exports = router;
