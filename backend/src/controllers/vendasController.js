const { db } = require('../db');

/**
 * Registrar nova venda
 * POST /api/vendas
 */
exports.registrarVenda = (req, res) => {
  const { cliente_id, itens, tipo_pagamento, status_pagamento, observacoes } = req.body;
  
  // Validação
  if (!cliente_id || !itens || !Array.isArray(itens) || itens.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Cliente e itens são obrigatórios'
    });
  }
  
  // Verificar se cliente existe
  db.get('SELECT id, tipo_pagamento FROM clientes WHERE id = ? AND ativo = 1', [cliente_id], (err, cliente) => {
    if (err) {
      console.error('Erro ao verificar cliente:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao verificar cliente'
      });
    }
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado ou inativo'
      });
    }
    
    // Calcular valor total
    let valorTotal = 0;
    const itensProcessados = [];
    
    // Processar cada item
    let processados = 0;
    itens.forEach(item => {
      const { garrafao_id, quantidade, preco_unitario } = item;
      
      if (!garrafao_id || !quantidade || !preco_unitario) {
        return res.status(400).json({
          success: false,
          message: 'Cada item deve ter garrafao_id, quantidade e preco_unitario'
        });
      }
      
      // Verificar se garrafão existe
      db.get('SELECT id, nome FROM garrafoes WHERE id = ? AND ativo = 1', [garrafao_id], (err, garrafao) => {
        if (err || !garrafao) {
          return res.status(400).json({
            success: false,
            message: `Garrafão ID ${garrafao_id} não encontrado`
          });
        }
        
        const subtotal = quantidade * preco_unitario;
        valorTotal += subtotal;
        
        itensProcessados.push({
          garrafao_id,
          quantidade,
          preco_unitario,
          subtotal
        });
        
        processados++;
        
        // Quando todos os itens forem processados, criar a venda
        if (processados === itens.length) {
          criarVenda();
        }
      });
    });
    
    function criarVenda() {
      // Inserir venda
      db.run(
        `INSERT INTO vendas (cliente_id, valor_total, status_pagamento, tipo_pagamento, observacoes)
         VALUES (?, ?, ?, ?, ?)`,
        [
          cliente_id,
          valorTotal,
          status_pagamento || 'a receber',
          tipo_pagamento || cliente.tipo_pagamento,
          observacoes || null
        ],
        function(err) {
          if (err) {
            console.error('Erro ao registrar venda:', err);
            return res.status(500).json({
              success: false,
              message: 'Erro ao registrar venda'
            });
          }
          
          const vendaId = this.lastID;
          
          // Inserir itens da venda
          const stmt = db.prepare(
            'INSERT INTO itens_venda (venda_id, garrafao_id, quantidade, preco_unitario, subtotal) VALUES (?, ?, ?, ?, ?)'
          );
          
          itensProcessados.forEach(item => {
            stmt.run(vendaId, item.garrafao_id, item.quantidade, item.preco_unitario, item.subtotal);
          });
          
          stmt.finalize((err) => {
            if (err) {
              console.error('Erro ao inserir itens da venda:', err);
              return res.status(500).json({
                success: false,
                message: 'Erro ao inserir itens da venda'
              });
            }
            
            res.status(201).json({
              success: true,
              message: 'Venda registrada com sucesso',
              data: {
                venda_id: vendaId,
                valor_total: valorTotal
              }
            });
          });
        }
      );
    }
  });
};

/**
 * Listar vendas
 * GET /api/vendas
 */
exports.listarVendas = (req, res) => {
  const { cliente_id, status_pagamento, data_inicio, data_fim } = req.query;
  
  let query = `
    SELECT v.*, c.nome as cliente_nome
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    WHERE 1=1
  `;
  const params = [];
  
  if (cliente_id) {
    query += ' AND v.cliente_id = ?';
    params.push(cliente_id);
  }
  
  if (status_pagamento) {
    query += ' AND v.status_pagamento = ?';
    params.push(status_pagamento);
  }
  
  if (data_inicio) {
    query += ' AND DATE(v.data) >= DATE(?)';
    params.push(data_inicio);
  }
  
  if (data_fim) {
    query += ' AND DATE(v.data) <= DATE(?)';
    params.push(data_fim);
  }
  
  query += ' ORDER BY v.data DESC';
  
  db.all(query, params, (err, vendas) => {
    if (err) {
      console.error('Erro ao listar vendas:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar vendas'
      });
    }
    
    res.json({
      success: true,
      data: vendas
    });
  });
};

/**
 * Obter detalhes de uma venda
 * GET /api/vendas/:id
 */
exports.obterVenda = (req, res) => {
  const { id } = req.params;
  
  db.get(`
    SELECT v.*, c.nome as cliente_nome, c.telefone, c.endereco
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    WHERE v.id = ?
  `, [id], (err, venda) => {
    if (err) {
      console.error('Erro ao buscar venda:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar venda'
      });
    }
    
    if (!venda) {
      return res.status(404).json({
        success: false,
        message: 'Venda não encontrada'
      });
    }
    
    // Buscar itens da venda
    db.all(`
      SELECT iv.*, g.nome as garrafao_nome, g.marca
      FROM itens_venda iv
      JOIN garrafoes g ON iv.garrafao_id = g.id
      WHERE iv.venda_id = ?
    `, [id], (err, itens) => {
      if (err) {
        console.error('Erro ao buscar itens da venda:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar itens da venda'
        });
      }
      
      res.json({
        success: true,
        data: {
          ...venda,
          itens: itens || []
        }
      });
    });
  });
};

/**
 * Atualizar status de pagamento
 * PATCH /api/vendas/:id/pagamento
 */
exports.atualizarPagamento = (req, res) => {
  const { id } = req.params;
  const { status_pagamento } = req.body;
  
  if (!status_pagamento || !['pago', 'a receber'].includes(status_pagamento)) {
    return res.status(400).json({
      success: false,
      message: 'Status de pagamento inválido. Use "pago" ou "a receber"'
    });
  }
  
  db.run(
    'UPDATE vendas SET status_pagamento = ?, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?',
    [status_pagamento, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar pagamento:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao atualizar pagamento'
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Venda não encontrada'
        });
      }
      
      res.json({
        success: true,
        message: 'Status de pagamento atualizado com sucesso'
      });
    }
  );
};
