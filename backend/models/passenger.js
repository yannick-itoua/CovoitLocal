const mongoose = require('mongoose');
const PassengerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
});

module.exports = mongoose.model('Passenger', PassengerSchema);