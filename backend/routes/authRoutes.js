const express = require('express');
const router = express.Router();
const { register, login, profile, logout } = require('../controllers/authController');
const { validateInputs, verifyToken } = require('../middlewares/index');

router.post('/register', validateInputs, register);
router.post('/login', login);
router.get('/profile', verifyToken, profile);
router.post('/logout', logout);

module.exports = router;
