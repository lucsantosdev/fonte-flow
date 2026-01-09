const { db } = require('../db');

/**
 * Obter dados do dashboard
 * GET /api/dashboard
 */
exports.getDashboard = (req, res) => {
  const dados = {};
  
  // Query para estoque (retiradas - vendas por garrafão)
  const queryEstoque = `
    SELECT 
      g.id,
      g.nome,
      g.marca,
      COALESCE(SUM(ir.quantidade), 0) as total_retirado,
      COALESCE(SUM(iv.quantidade), 0) as total_vendido,
      COALESCE(SUM(ir.quantidade), 0) - COALESCE(SUM(iv.quantidade), 0) as estoque_atual
    FROM garrafoes g
    LEFT JOIN itens_retirada ir ON g.id = ir.garrafao_id
    LEFT JOIN itens_venda iv ON g.id = iv.garrafao_id
    WHERE g.ativo = 1
    GROUP BY g.id, g.nome, g.marca
  `;
  
  // Query para vendas do dia
  const queryVendasDia = `
    SELECT 
      COUNT(*) as total_vendas,
      COALESCE(SUM(valor_total), 0) as valor_total,
      COALESCE(SUM(CASE WHEN status_pagamento = 'pago' THEN valor_total ELSE 0 END), 0) as valor_pago,
      COALESCE(SUM(CASE WHEN status_pagamento = 'a receber' THEN valor_total ELSE 0 END), 0) as valor_a_receber
    FROM vendas
    WHERE DATE(data) = DATE('now')
  `;
  
  // Query para vendas do mês
  const queryVendasMes = `
    SELECT 
      COUNT(*) as total_vendas,
      COALESCE(SUM(valor_total), 0) as valor_total,
      COALESCE(SUM(CASE WHEN status_pagamento = 'pago' THEN valor_total ELSE 0 END), 0) as valor_pago,
      COALESCE(SUM(CASE WHEN status_pagamento = 'a receber' THEN valor_total ELSE 0 END), 0) as valor_a_receber
    FROM vendas
    WHERE strftime('%Y-%m', data) = strftime('%Y-%m', 'now')
  `;
  
  // Query para retiradas do mês
  const queryRetiradasMes = `
    SELECT 
      COUNT(*) as total_retiradas,
      COALESCE(SUM(valor_total), 0) as valor_total
    FROM retiradas
    WHERE strftime('%Y-%m', data) = strftime('%Y-%m', 'now')
  `;
  
  // Query para vendas recentes
  const queryVendasRecentes = `
    SELECT 
      v.id,
      v.data,
      v.valor_total,
      v.status_pagamento,
      c.nome as cliente_nome
    FROM vendas v
    JOIN clientes c ON v.cliente_id = c.id
    ORDER BY v.data DESC
    LIMIT 10
  `;
  
  // Query para gráfico de vendas (últimos 7 dias)
  const queryGraficoVendas = `
    SELECT 
      DATE(data) as data,
      COUNT(*) as quantidade,
      COALESCE(SUM(valor_total), 0) as valor
    FROM vendas
    WHERE DATE(data) >= DATE('now', '-7 days')
    GROUP BY DATE(data)
    ORDER BY data ASC
  `;
  
  // Executar todas as queries
  db.get(queryEstoque, [], (err, estoque) => {
    if (err) console.error('Erro ao buscar estoque:', err);
    
    db.all(queryEstoque, [], (err, estoqueDetalhado) => {
      if (err) console.error('Erro ao buscar estoque detalhado:', err);
      dados.estoque = estoqueDetalhado || [];
      
      db.get(queryVendasDia, [], (err, vendasDia) => {
        if (err) console.error('Erro ao buscar vendas do dia:', err);
        dados.vendas_dia = vendasDia || {};
        
        db.get(queryVendasMes, [], (err, vendasMes) => {
          if (err) console.error('Erro ao buscar vendas do mês:', err);
          dados.vendas_mes = vendasMes || {};
          
          db.get(queryRetiradasMes, [], (err, retiradasMes) => {
            if (err) console.error('Erro ao buscar retiradas do mês:', err);
            dados.retiradas_mes = retiradasMes || {};
            
            db.all(queryVendasRecentes, [], (err, vendasRecentes) => {
              if (err) console.error('Erro ao buscar vendas recentes:', err);
              dados.vendas_recentes = vendasRecentes || [];
              
              db.all(queryGraficoVendas, [], (err, graficoVendas) => {
                if (err) console.error('Erro ao buscar gráfico de vendas:', err);
                dados.grafico_vendas = graficoVendas || [];
                
                // Calcular totais gerais
                dados.resumo = {
                  estoque_total: dados.estoque.reduce((acc, item) => acc + (item.estoque_atual || 0), 0),
                  vendas_dia_total: dados.vendas_dia.valor_total || 0,
                  vendas_mes_total: dados.vendas_mes.valor_total || 0,
                  retiradas_mes_total: dados.retiradas_mes.valor_total || 0,
                  lucro_estimado_mes: (dados.vendas_mes.valor_total || 0) - (dados.retiradas_mes.valor_total || 0)
                };
                
                res.json({
                  success: true,
                  data: dados
                });
              });
            });
          });
        });
      });
    });
  });
};

/**
 * Obter estatísticas gerais
 * GET /api/dashboard/stats
 */
exports.getStats = (req, res) => {
  const stats = {};
  
  // Total de clientes ativos
  db.get('SELECT COUNT(*) as total FROM clientes WHERE ativo = 1', [], (err, result) => {
    if (err) console.error('Erro ao contar clientes:', err);
    stats.total_clientes = result?.total || 0;
    
    // Total de vendas
    db.get('SELECT COUNT(*) as total FROM vendas', [], (err, result) => {
      if (err) console.error('Erro ao contar vendas:', err);
      stats.total_vendas = result?.total || 0;
      
      // Total de retiradas
      db.get('SELECT COUNT(*) as total FROM retiradas', [], (err, result) => {
        if (err) console.error('Erro ao contar retiradas:', err);
        stats.total_retiradas = result?.total || 0;
        
        res.json({
          success: true,
          data: stats
        });
      });
    });
  });
};
