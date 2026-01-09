const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

// Caminho do banco de dados
const dbPath = path.resolve(__dirname, '../database.sqlite');

// Criar conexão com banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('✅ Conectado ao banco de dados SQLite');
  }
});

// Habilitar Foreign Keys
db.run('PRAGMA foreign_keys = ON');

/**
 * Função para criar as tabelas do banco de dados
 */
function createTables() {
  db.serialize(() => {
    // Tabela de usuários (autenticação)
    db.run(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cargo TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        senha_hash TEXT NOT NULL,
        ativo BOOLEAN DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de veículos
    db.run(`
      CREATE TABLE IF NOT EXISTS veiculos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        placa TEXT UNIQUE,
        capacidade INTEGER NOT NULL,
        ativo BOOLEAN DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de tipos de garrafões
    db.run(`
      CREATE TABLE IF NOT EXISTS garrafoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        marca TEXT,
        custo REAL NOT NULL,
        descricao TEXT,
        ativo BOOLEAN DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de clientes
    db.run(`
      CREATE TABLE IF NOT EXISTS clientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        telefone TEXT,
        endereco TEXT,
        tipo_pagamento TEXT DEFAULT 'à vista',
        observacoes TEXT,
        ativo BOOLEAN DEFAULT 1,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de preços personalizados por cliente e garrafão
    // Relacionamento Many-to-Many entre clientes e garrafões
    db.run(`
      CREATE TABLE IF NOT EXISTS clientes_precos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        garrafao_id INTEGER NOT NULL,
        preco_personalizado REAL NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE CASCADE,
        FOREIGN KEY (garrafao_id) REFERENCES garrafoes(id) ON DELETE CASCADE,
        UNIQUE(cliente_id, garrafao_id)
      )
    `);

    // Tabela de vendas (cabeçalho)
    db.run(`
      CREATE TABLE IF NOT EXISTS vendas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        cliente_id INTEGER NOT NULL,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        valor_total REAL NOT NULL DEFAULT 0,
        status_pagamento TEXT DEFAULT 'a receber',
        tipo_pagamento TEXT,
        observacoes TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cliente_id) REFERENCES clientes(id) ON DELETE RESTRICT
      )
    `);

    // Tabela de itens da venda (detalhamento)
    db.run(`
      CREATE TABLE IF NOT EXISTS itens_venda (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        venda_id INTEGER NOT NULL,
        garrafao_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        preco_unitario REAL NOT NULL,
        subtotal REAL NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (venda_id) REFERENCES vendas(id) ON DELETE CASCADE,
        FOREIGN KEY (garrafao_id) REFERENCES garrafoes(id) ON DELETE RESTRICT
      )
    `);

    // Tabela de retiradas da fornecedora (cabeçalho)
    db.run(`
      CREATE TABLE IF NOT EXISTS retiradas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        data DATETIME DEFAULT CURRENT_TIMESTAMP,
        valor_total REAL NOT NULL DEFAULT 0,
        observacoes TEXT,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        atualizado_em DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabela de itens da retirada (relacionamento Many-to-Many)
    db.run(`
      CREATE TABLE IF NOT EXISTS itens_retirada (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        retirada_id INTEGER NOT NULL,
        garrafao_id INTEGER NOT NULL,
        quantidade INTEGER NOT NULL,
        custo_unitario REAL NOT NULL,
        subtotal REAL NOT NULL,
        criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (retirada_id) REFERENCES retiradas(id) ON DELETE CASCADE,
        FOREIGN KEY (garrafao_id) REFERENCES garrafoes(id) ON DELETE RESTRICT
      )
    `);

    console.log('✅ Tabelas criadas com sucesso');
  });
}

/**
 * Função para inserir dados iniciais
 */
function seedDatabase() {
  db.serialize(() => {
    // Verificar se já existe usuário
    db.get('SELECT id FROM usuarios LIMIT 1', (err, row) => {
      if (err) {
        console.error('❌ Erro ao verificar usuários:', err.message);
        return;
      }

      // Se não existir usuário, criar usuário padrão
      if (!row) {
        const senhaHash = bcrypt.hashSync('admin123', 10);
        
        db.run(`
          INSERT INTO usuarios (nome, cargo, email, senha_hash)
          VALUES (?, ?, ?, ?)
        `, ['Administrador', 'Gerente', 'admin@fonteflow.com', senhaHash], (err) => {
          if (err) {
            console.error('❌ Erro ao criar usuário padrão:', err.message);
          } else {
            console.log('✅ Usuário padrão criado: admin@fonteflow.com / admin123');
          }
        });

        // Inserir garrafões padrão
        const garrafoesPadrao = [
          ['Garrafão 20L', 'Marca A', 2.00],
          ['Garrafão 10L', 'Marca A', 1.50],
          ['Garrafão 20L Premium', 'Marca B', 2.50]
        ];

        garrafoesPadrao.forEach(([nome, marca, custo]) => {
          db.run(`
            INSERT INTO garrafoes (nome, marca, custo)
            VALUES (?, ?, ?)
          `, [nome, marca, custo]);
        });

        console.log('✅ Dados iniciais inseridos');
      } else {
        console.log('ℹ️  Banco de dados já possui dados iniciais');
      }
    });
  });
}

/**
 * Inicializar banco de dados
 */
function initializeDatabase() {
  createTables();
  setTimeout(() => {
    seedDatabase();
  }, 500); // Aguarda criação das tabelas
}

// Exportar instância do banco e funções
module.exports = {
  db,
  initializeDatabase
};
