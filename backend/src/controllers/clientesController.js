const { db } = require('../db');

/**
 * Listar todos os clientes
 * GET /api/clientes
 */
exports.listarClientes = (req, res) => {
  const { ativo } = req.query;
  
  let query = 'SELECT * FROM clientes';
  const params = [];
  
  // Filtrar por status ativo se especificado
  if (ativo !== undefined) {
    query += ' WHERE ativo = ?';
    params.push(ativo === 'true' || ativo === '1' ? 1 : 0);
  }
  
  query += ' ORDER BY nome ASC';
  
  db.all(query, params, (err, clientes) => {
    if (err) {
      console.error('Erro ao listar clientes:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar clientes'
      });
    }
    
    res.json({
      success: true,
      data: clientes
    });
  });
};

/**
 * Obter um cliente por ID
 * GET /api/clientes/:id
 */
exports.obterCliente = (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, cliente) => {
    if (err) {
      console.error('Erro ao buscar cliente:', err);
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar cliente'
      });
    }
    
    if (!cliente) {
      return res.status(404).json({
        success: false,
        message: 'Cliente não encontrado'
      });
    }
    
    // Buscar preços personalizados do cliente
    db.all(`
      SELECT cp.*, g.nome as garrafao_nome, g.marca 
      FROM clientes_precos cp
      JOIN garrafoes g ON cp.garrafao_id = g.id
      WHERE cp.cliente_id = ?
    `, [id], (err, precos) => {
      if (err) {
        console.error('Erro ao buscar preços:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao buscar preços do cliente'
        });
      }
      
      res.json({
        success: true,
        data: {
          ...cliente,
          precos: precos || []
        }
      });
    });
  });
};

/**
 * Cadastrar novo cliente
 * POST /api/clientes
 */
exports.cadastrarCliente = (req, res) => {
  const { nome, telefone, endereco, tipo_pagamento, observacoes, precos } = req.body;
  
  // Validação
  if (!nome) {
    return res.status(400).json({
      success: false,
      message: 'Nome é obrigatório'
    });
  }
  
  // Inserir cliente
  db.run(
    `INSERT INTO clientes (nome, telefone, endereco, tipo_pagamento, observacoes)
     VALUES (?, ?, ?, ?, ?)`,
    [nome, telefone || null, endereco || null, tipo_pagamento || 'à vista', observacoes || null],
    function(err) {
      if (err) {
        console.error('Erro ao cadastrar cliente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao cadastrar cliente'
        });
      }
      
      const clienteId = this.lastID;
      
      // Se tiver preços personalizados, inserir
      if (precos && Array.isArray(precos) && precos.length > 0) {
        const stmt = db.prepare(
          'INSERT INTO clientes_precos (cliente_id, garrafao_id, preco_personalizado) VALUES (?, ?, ?)'
        );
        
        precos.forEach(preco => {
          stmt.run(clienteId, preco.garrafao_id, preco.preco_personalizado);
        });
        
        stmt.finalize();
      }
      
      res.status(201).json({
        success: true,
        message: 'Cliente cadastrado com sucesso',
        data: { id: clienteId }
      });
    }
  );
};

/**
 * Atualizar cliente
 * PUT /api/clientes/:id
 */
exports.atualizarCliente = (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco, tipo_pagamento, observacoes, ativo, precos } = req.body;
  
  db.run(
    `UPDATE clientes 
     SET nome = COALESCE(?, nome),
         telefone = COALESCE(?, telefone),
         endereco = COALESCE(?, endereco),
         tipo_pagamento = COALESCE(?, tipo_pagamento),
         observacoes = COALESCE(?, observacoes),
         ativo = COALESCE(?, ativo),
         atualizado_em = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [nome, telefone, endereco, tipo_pagamento, observacoes, ativo, id],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar cliente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao atualizar cliente'
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      // Atualizar preços se fornecidos
      if (precos && Array.isArray(precos)) {
        // Remover preços antigos
        db.run('DELETE FROM clientes_precos WHERE cliente_id = ?', [id], (err) => {
          if (err) {
            console.error('Erro ao atualizar preços:', err);
          }
          
          // Inserir novos preços
          if (precos.length > 0) {
            const stmt = db.prepare(
              'INSERT INTO clientes_precos (cliente_id, garrafao_id, preco_personalizado) VALUES (?, ?, ?)'
            );
            
            precos.forEach(preco => {
              stmt.run(id, preco.garrafao_id, preco.preco_personalizado);
            });
            
            stmt.finalize();
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Cliente atualizado com sucesso'
      });
    }
  );
};

/**
 * Desativar cliente (soft delete)
 * DELETE /api/clientes/:id
 */
exports.desativarCliente = (req, res) => {
  const { id } = req.params;
  
  db.run(
    'UPDATE clientes SET ativo = 0, atualizado_em = CURRENT_TIMESTAMP WHERE id = ?',
    [id],
    function(err) {
      if (err) {
        console.error('Erro ao desativar cliente:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro ao desativar cliente'
        });
      }
      
      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Cliente não encontrado'
        });
      }
      
      res.json({
        success: true,
        message: 'Cliente desativado com sucesso'
      });
    }
  );
};
