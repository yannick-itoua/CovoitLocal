var express = require('express');
var router = express.Router();
var passengerController = require('../controllers/passengercontroller');

router.get('/', passengerController.getPassengers);
router.get('/:id', passengerController.getPassenger);
router.post('/', passengerController.createPassenger);
router.post('/login', passengerController.loginPassenger);
router.put('/:id', passengerController.updatePassenger);
router.delete('/:id', passengerController.deletePassenger);
router.post('/:passengerId/trips/:tripId', passengerController.bookTrip);
router.delete('/:passengerId/trips/:tripId', passengerController.cancelTrip);

module.exports = router;
