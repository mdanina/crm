const express = require('express');
const router = express.Router();
const psychologistsController = require('../controllers/psychologistsController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', psychologistsController.getAllPsychologists);
router.get('/:id', psychologistsController.getPsychologistById);
router.post('/', psychologistsController.createPsychologist);
router.put('/:id', psychologistsController.updatePsychologist);
router.delete('/:id', psychologistsController.deletePsychologist);

module.exports = router;
