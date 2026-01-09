const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db');

/**
 * Controller de Login
 * POST /api/auth/login
 */
exports.login = (req, res) => {
  const { email, senha } = req.body;

  // Validar campos obrigatórios
  if (!email || !senha) {
    return res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }

  // Buscar usuário no banco
  db.get(
    'SELECT * FROM usuarios WHERE email = ? AND ativo = 1',
    [email],
    (err, user) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

      // Verificar se usuário existe
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Verificar senha
      const senhaValida = bcrypt.compareSync(senha, user.senha_hash);
      
      if (!senhaValida) {
        return res.status(401).json({
          success: false,
          message: 'Credenciais inválidas'
        });
      }

      // Gerar token JWT
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nome: user.nome,
          cargo: user.cargo
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Retornar sucesso com token
      res.json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          token,
          user: {
            id: user.id,
            nome: user.nome,
            email: user.email,
            cargo: user.cargo
          }
        }
      });
    }
  );
};

/**
 * Controller de Verificação de Token
 * GET /api/auth/me
 */
exports.me = (req, res) => {
  // Os dados do usuário já foram injetados pelo middleware authenticateToken
  const { id, email, nome, cargo } = req.user;

  // Buscar dados atualizados do usuário
  db.get(
    'SELECT id, nome, email, cargo, criado_em FROM usuarios WHERE id = ? AND ativo = 1',
    [id],
    (err, user) => {
      if (err) {
        console.error('Erro ao buscar usuário:', err);
        return res.status(500).json({
          success: false,
          message: 'Erro interno do servidor'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'Usuário não encontrado'
        });
      }

      res.json({
        success: true,
        data: user
      });
    }
  );
};

/**
 * Controller de Logout (opcional - apenas para limpar token no client)
 * POST /api/auth/logout
 */
exports.logout = (req, res) => {
  // JWT é stateless, então o logout é feito no cliente removendo o token
  res.json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
};
