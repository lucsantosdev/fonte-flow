const express = require('express');
const router = express.Router();
const vendasController = require('../controllers/vendasController');
const { authenticateToken } = require('../middlewares/auth');

// Todas as rotas de vendas são protegidas
router.use(authenticateToken);

/**
 * @route   GET /api/vendas
 * @desc    Listar vendas
 * @access  Private
 */
router.get('/', vendasController.listarVendas);

/**
 * @route   GET /api/vendas/:id
 * @desc    Obter detalhes de uma venda
 * @access  Private
 */
router.get('/:id', vendasController.obterVenda);

/**
 * @route   POST /api/vendas
 * @desc    Registrar nova venda
 * @access  Private
 */
router.post('/', vendasController.registrarVenda);

/**
 * @route   PATCH /api/vendas/:id/pagamento
 * @desc    Atualizar status de pagamento
 * @access  Private
 */
router.patch('/:id/pagamento', vendasController.atualizarPagamento);

module.exports = router;
