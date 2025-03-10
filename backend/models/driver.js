const mongoose = require('mongoose');
const DriverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    car: { type: String, required: true },
    seats: { type: Number, required: true },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

module.exports = mongoose.model('Driver', DriverSchema);