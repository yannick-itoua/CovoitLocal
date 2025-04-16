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
    if (!trip.driver) {
        return res.status(400).json({ message: 'Driver is required' });
    }
    try {
        const newTrip = new Trip(trip);
        await newTrip.save();
        res.status(201).json(newTrip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(409).json({ message: error.message });
    }
}; 

const bookTrip = async (req, res) => {
    const { tripId, passengerId } = req.body;
    try {
        const trip = await Trip.findById(tripId);
        const passenger = await Passenger.findById(passengerId);

        if (!trip || !passenger) {
            return res.status(404).json({ message: 'Trip or passenger not found' });
        }

        // Prevent double booking
        if (trip.passengers.includes(passengerId)) {
            return res.status(400).json({ message: 'Already booked' });
        }

        if (trip.seats <= 0) {
            return res.status(400).json({ message: 'No seats available' });
        }

        trip.passengers.push(passengerId);
        trip.seats -= 1;
        await trip.save();

        // Optionally, also add the trip to the passenger's trips array
        if (!passenger.trips.includes(tripId)) {
            passenger.trips.push(tripId);
            await passenger.save();
        }

        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

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

const cancelTrip = async (req, res) => {
    const { tripId, passengerId } = req.body;
    try {
        const trip = await Trip.findById(tripId);
        if (!trip) return res.status(404).json({ message: 'Trip not found' });

        // Remove passenger from trip
        trip.passengers = trip.passengers.filter(
            (p) => p.toString() !== passengerId
        );
        trip.seats += 1;
        await trip.save();

        // Optionally, remove trip from passenger's trips array
        const passenger = await Passenger.findById(passengerId);
        if (passenger) {
            passenger.trips = passenger.trips.filter(
                (t) => t.toString() !== tripId
            );
            await passenger.save();
        }

        res.json(trip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = {
    getTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    bookTrip,
    cancelTrip,
    getTrip
}
