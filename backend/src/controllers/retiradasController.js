const { db } = require('../db');

/**
 * Registrar nova retirada
 * POST /api/retiradas
 */
exports.registrarRetirada = (req, res) => {
  const { itens, observacoes } = req.body;
  
  // Validação
  if (!itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Itens são obrigatórios'
    });
  }
  
  // Calcular valor total
  let valorTotal = 0;
  const itensProcessados = [];
  
  // Processar cada item
  let processados = 0;
  itens.forEach(item => {
    const { garrafao_id, quantidade } = item;
    
    if (!garrafao_id || !quantidade) {
      return res.status(400).json({
        success: false,
        message: 'Cada item deve ter garrafao_id e quantidade'
      });
    }
    
    // Buscar custo do garrafão
    db.get('SELECT id, nome, custo FROM garrafoes WHERE id = ? AND ativo = 1', [garrafao_id], (err, garrafao) => {
      if (err) {
        console.error('Erro ao buscar garrafão:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar garrafão'
        });
      }
      
      if (!garrafao) {
        return res.status(400).json({
          success: false,
          message: `Garrafão ID ${garrafao_id} não encontrado`
        });
      }
      
      const subtotal = quantidade * garrafao.custo;
      valorTotal += subtotal;
      
      itensProcessados.push({
        garrafao_id,
        quantidade,
        custo_unitario: garrafao.custo,
        subtotal
      });
      
      processados++;
      
      // Quando todos os itens forem processados, criar a retirada
      if (processados === itens.length) {
        criarRetirada();
      }
    });
  });
  
  function criarRetirada() {
    // Inserir retirada
    db.run(
      'INSERT INTO retiradas (valor_total, observacoes) VALUES (?, ?)',
      [valorTotal, observacoes || null],
      function(err) {
        if (err) {
          console.error('Erro ao registrar retirada:', err);
          return res.status(500).json({
            success: false,
            message: 'Erro ao registrar retirada'
          });
        }
        
        const retiradaId = this.lastID;
        
        // Inserir itens da retirada
        const stmt = db.prepare(
          'INSERT INTO itens_retirada (retirada_id, garrafao_id, quantidade, custo_unitario, subtotal) VALUES (?, ?, ?, ?, ?)'
        );
        
        itensProcessados.forEach(item => {
          stmt.run(retiradaId, item.garrafao_id, item.quantidade, item.custo_unitario, item.subtotal);
        });
        
        stmt.finalize((err) => {
          if (err) {
            console.error('Erro ao inserir itens da retirada:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao inserir itens da retirada'
            });
          }
          
          res.status(201).json({
            success: true,
            message: 'Retirada registrada com sucesso',
            data: {
              retirada_id: retiradaId,
              valor_total: valorTotal
            }
          });
        });
      }
    );
  }
};

/**
 * Listar retiradas
 * GET /api/retiradas
 */
exports.listarRetiradas = (req, res) => {
  const { data_inicio, data_fim } = req.query;
  
  let query = 'SELECT * FROM retiradas WHERE 1=1';
  const params = [];
  
  if (data_inicio) {
    query += ' AND DATE(data) >= DATE(?)';
    params.push(data_inicio);
  }
  
  if (data_fim) {
    query += ' AND DATE(data) <= DATE(?)';
    params.push(data_fim);
  }
  
  query += ' ORDER BY data DESC';
  
  db.all(query, params, (err, retiradas) => {
    if (err) {
      console.error('Erro ao listar retiradas:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar retiradas'
      });
    }
    
    res.json({
      success: true,
      data: retiradas
    });
  });
};

/**
 * Obter detalhes de uma retirada
 * GET /api/retiradas/:id
 */
exports.obterRetirada = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM retiradas WHERE id = ?', [id], (err, retirada) => {
    if (err) {
      console.error('Erro ao buscar retirada:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar retirada'
      });
    }
    
    if (!retirada) {
      return res.status(404).json({
        success: false,
        message: 'Retirada não encontrada'
      });
    }
    
    // Buscar itens da retirada
    db.all(`
      SELECT ir.*, g.nome as garrafao_nome, g.marca
      FROM itens_retirada ir
      JOIN garrafoes g ON ir.garrafao_id = g.id
      WHERE ir.retirada_id = ?
    `, [id], (err, itens) => {
      if (err) {
        console.error('Erro ao buscar itens da retirada:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar itens da retirada'
        });
      }
      
      res.json({
        success: true,
        data: {
          ...retirada,
          itens: itens || []
        }
      });
    });
  });
};
