const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clientsController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', clientsController.getAllClients);
router.get('/:id', clientsController.getClientById);
router.post('/', clientsController.createClient);
router.put('/:id', clientsController.updateClient);
router.delete('/:id', clientsController.deleteClient);
router.get('/:id/sessions', clientsController.getClientSessions);

module.exports = router;
