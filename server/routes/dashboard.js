const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/statistics', dashboardController.getStatistics);
router.get('/recent-appointments', dashboardController.getRecentAppointments);
router.get('/revenue-by-month', dashboardController.getRevenueByMonth);

module.exports = router;
