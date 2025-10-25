const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', authenticateToken, authController.getCurrentUser);
router.get('/check-setup', authController.checkSetup);
router.post('/setup-admin', authController.setupAdmin);

module.exports = router;
