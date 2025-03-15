const mongoose = require('mongoose');
const Passenger = require('../models/passenger');
const Trip = require('../models/trip');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { JWT_SECRET } = require('../config');

const getPassenger = async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.id).populate('trips');
        res.status(200).json(passenger);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getPassengers = async (req, res) => {
    try {
        const passengers = await Passenger.find().populate('trips');
        res.status(200).json(passengers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const createPassenger = async (req, res) => {
    const { name, email, phone, password } = req.body;
    try {
        const existingPassenger = await Passenger.findOne({
            email,
        }); // Check if passenger already exists
        if (existingPassenger) {
            return res.status(400).json({ message: 'Passenger already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const passenger = await Passenger.create({
            name,
            email,
            phone,
            password: hashedPassword,
        });
        const token = jwt.sign({ id: passenger._id }, JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(201).json({ passenger, token });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const loginPassenger = async (req, res) => {
    const { email, password } = req.body;
    try {
        const passenger = await Passenger.findOne({ email });
        if (!passenger) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(password, passenger.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        const token = jwt.sign({ id: passenger._id }, JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updatePassenger = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 12);
        const passenger = await Passenger.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            password: hashedPassword,
        });
        res.status(200).json(passenger);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deletePassenger = async (req, res) => {
    try {
        const passenger = await Passenger.findByIdAndDelete(req.params.id);
        res.status(200).json(passenger);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const bookTrip = async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.passengerId);
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        passenger.trips.push(trip._id);
        await passenger.save();
        res.status(200).json(passenger);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

const cancelTrip = async (req, res) => {
    try {
        const passenger = await Passenger.findById(req.params.passengerId);
        const trip = await Trip.findById(req.params.tripId);
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }
        passenger.trips = passenger.trips.filter((id) => id !== trip._id);
        await passenger.save();
        res.status(200).json(passenger);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

module.exports = {
    getPassenger,
    getPassengers,
    createPassenger,
    loginPassenger,
    updatePassenger,
    deletePassenger,
    bookTrip,
    cancelTrip,
};