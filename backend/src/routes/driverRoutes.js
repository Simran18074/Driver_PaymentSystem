const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');

router.get('/', driverController.getDrivers);
router.post('/', driverController.createDriver);
router.put('/:id', driverController.updateDriverPreference);
router.delete('/:id', driverController.deleteDriver);

module.exports = router;
