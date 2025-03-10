const mongoose = require('mongoose');
const Driver = require('../models/driver'); 
const Trip = require('../models/trip');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');


const getDriver = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id).populate('trips');
        res.status(200).json(driver);
    } catch (error) {
        res.status(400).json(error);
    }
};

const getDrivers = async (req, res) => {
    try {
        const drivers = await Driver.find().populate('trips');
        res.status(200).json(drivers);
    } catch (error) {
        res.status(400).json(error);
    }
};

const createDriver = async (req, res) => {
    const { name, email, phone, password, car, seats,trips } = req.body;
    try {
        const existingDriver = await Driver.findOne({
            email,
        }); // Check if driver already exists
        if (existingDriver) {
            return res.status(400).json({ message: 'Driver already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const driver = await Driver.create({
            name,
            email,
            phone,
            password: hashedPassword,
            car,
            seats,
            trips
        });
        const token = jwt.sign({ id: driver._id }, config.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(201).json({ driver, token });
    }
    catch (error) {
        res.status(400).json(error);
    }
}

const loginDriver = async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingDriver = await Driver.findOne({
            email,
        });
        if (!existingDriver) {
            return res.status(404).json({ message: 'Driver does not exist' });
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingDriver.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid password' });
        }   
        const token = jwt.sign({ id: existingDriver._id }, config.JWT_SECRET, {
            expiresIn: '1h',
        });
        res.status(200).json({ driver: existingDriver, token });
    }
    catch (error) {
        res.status(400).json(error);
    }
}

const updateDriver = async (req, res) => {
    try {
        const { name, email, phone, password, car, seats } = req.body;
        const driver = await Driver.findByIdAndUpdate(req.params.id, {
            name,
            email,
            phone,
            password,
            car,
            seats,
        });
        res.status(200).json(driver);
    }
    catch (error) {
        res.status(400).json(error);
    }
}

const deleteDriver = async (req, res) => {
    try {
        const driver = await Driver.findByIdAndDelete(req.params.id);
        res.status(200).json(driver);
    } catch (error) {
        res.status(400).json(error);
    }
}

const addTrip = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        const trip = await Trip.create(req.body);
        driver.trips.push(trip._id);
        await driver.save();
        res.status(201).json(driver);
    } catch (error) {
        res.status(400).json(error);
    }
}

const deleteTrip = async (req, res) => {
    try {
        const driver = await Driver.findById(req.params.id);
        driver.trips.pull(req.params.tripId);
        await driver.save();
        res.status(200).json(driver);
    } catch (error) {
        res.status(400).json(error);
    }
}

const updateTrip = async (req, res) => {
    try {
        const trip = await Trip.findByIdAndUpdate(req.params.tripId, req.body);
        res.status(200).json(trip);
    } catch (error) {
        res.status(400).json(error);
    }
}

module.exports = {
    getDriver,
    getDrivers,
    createDriver,
    loginDriver,
    updateDriver,
    deleteDriver,
    addTrip,
    deleteTrip,
    updateTrip
};
