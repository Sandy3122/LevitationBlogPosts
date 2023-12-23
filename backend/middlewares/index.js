const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const secret = 'asdfe45we45w345wegw345werjktjwertkj';

// Input validation middleware
const validateInputs = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  };


// Middleware for token verification
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token verification failed' });

    req.user = decoded;
    next();
  });
};

module.exports = { validateInputs, verifyToken };
