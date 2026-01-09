const jwt = require('jsonwebtoken');

/**
 * Middleware de autenticação JWT
 * Verifica se o token é válido e adiciona os dados do usuário na requisição
 */
function authenticateToken(req, res, next) {
  // Pegar token do header Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  // Verificar se token foi fornecido
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Token de autenticação não fornecido'
    });
  }

  // Verificar validade do token
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }

    // Adicionar dados do usuário na requisição
    req.user = user;
    next();
  });
}

/**
 * Middleware opcional - permite acesso mesmo sem token
 * Útil para rotas que podem ter comportamento diferente com/sem login
 */
function optionalAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      req.user = null;
    } else {
      req.user = user;
    }
    next();
  });
}

module.exports = {
  authenticateToken,
  optionalAuth
};
