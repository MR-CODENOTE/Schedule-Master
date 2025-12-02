const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'No token provided!' });
  }

  if (token.startsWith('Bearer ')) {
    // Remove Bearer from string
    token = token.slice(7, token.length);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Unauthorized!' });
    }
    req.user = decoded; // Contains { id, username, role }
    next();
  });
};

const authorizeRole = (requiredRole) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ message: 'User role not found.' });
  }
  if (req.user.role !== requiredRole) {
    return res.status(403).json({ message: `Requires ${requiredRole} role.` });
  }
  next();
};

const authorizeAdmin = authorizeRole('admin');

module.exports = { verifyToken, authorizeRole, authorizeAdmin };