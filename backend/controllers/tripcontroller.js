const mongoose = require('mongoose');
const Trip = require('../models/trip');
const Passenger = require('../models/passenger');
const Driver = require('../models/driver');

const getTrips = async (req, res) => {
    try {
        const trips = await Trip.find();
        res.status(200).json(trips);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const createTrip = async (req, res) => {
    const trip = req.body;
    const newTrip = new Trip(trip);
    try {
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
}

const updateTrip = async (req, res) => {
    const { id } = req.params;
    const trip = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No trip with that id');
    const updatedTrip = await Trip.findByIdAndUpdate(id, trip, { new: true });
    res.json(updatedTrip);
}

const deleteTrip = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No trip with that id');
    await Trip.findByIdAndDelete(id);
    res.json({ message: 'Trip deleted successfully' });
}

const getTrip = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No trip with that id');
    const trip = await Trip.findById(id);
    res.json(trip);
}

module.exports = {
    getTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTrip
}
