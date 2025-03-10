var express = require('express');
var router = express.Router();
var driverController = require('../controllers/drivercontroller');

router.get('/', driverController.getDrivers);
router.get('/:id', driverController.getDriver);
router.post('/', driverController.createDriver);
router.post('/login', driverController.loginDriver);
router.put('/:id', driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);
router.post('/:id/trips', driverController.addTrip);
router.delete('/:id/trips/:tripId', driverController.deleteTrip);
router.put('/:id/trips/:tripId', driverController.updateTrip);

module.exports = router;