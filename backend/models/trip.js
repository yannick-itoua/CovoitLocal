const mongoose = require('mongoose');
const TripSchema = new mongoose.Schema({
    departure: { type: String, required: true },
    arrival: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver', required: true },
    passengers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Passenger' }]
});

module.exports = mongoose.model('Trip', TripSchema);