var express = require('express');
var router = express.Router();
var tripController = require('../controllers/tripcontroller');


router.get('/', tripController.getTrips);
router.post('/', tripController.createTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);
router.get('/:id', tripController.getTrip);
router.post('/book', tripController.bookTrip);
router.post('/cancel', tripController.cancelTrip);

module.exports = router;