'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAllTrips, createTrip, updateTrip, deleteTrip } from '../utils/api';

interface Trip {
    _id?: string;
    id?: string;
    departure: string;
    arrival: string;
    date: string;
    time: string;
    arrivalTime: string;
    seats: number;
    price: number;
    driver: string;
    passengers: string[];
}

interface TripFormData {
    departure: string;
    arrival: string;
    date: string;
    time: string;
    arrivalTime: string;
    seats: string;
    price: string;
}

interface User {
    _id: string;
    role: string;
    name: string;
}

export default function Gestion() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTrip, setNewTrip] = useState<TripFormData>({
        departure: '',
        arrival: '',
        date: '',
        time: '',
        arrivalTime: '',
        seats: '',
        price: '',
    });
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                console.log('Loaded user data:', parsedUser);

                if (!parsedUser._id) {
                    console.error('User ID is missing from stored data');
                    alert('Invalid user data. Please log in again.');
                    router.push('/login');
                    return;
                }

                if (parsedUser.role !== 'driver') {
                    console.log('Access denied: User is not a driver');
                    alert('Access denied. Only drivers can access this page.');
                    router.push('/');
                    return;
                }

                console.log('Setting user state with:', parsedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                router.push('/login');
            }
        } else {
            console.log('No user data found in localStorage');
            alert('Please log in to access this page.');
            router.push('/login');
        }
    }, [router]);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                console.log('Fetching trips...');
                const allTrips = await getAllTrips();
                console.log('Fetched trips:', allTrips);
                setTrips(allTrips);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTrips();
        }
    }, [user]);

const handleCreateTrip = async () => {
    try {
        // Debug the user state first
        console.log('Current user state:', user);
        
        // Verify user ID is available
        if (!user || !user._id) {
            console.error('User or user ID is missing:', user);
            alert('User ID is missing. Please log in again.');
            router.push('/login');
            return;
        }

        const missingFields = [];
        
        if (!newTrip.departure) missingFields.push('Departure');
        if (!newTrip.arrival) missingFields.push('Arrival');
        if (!newTrip.date) missingFields.push('Date');
        if (!newTrip.time) missingFields.push('Departure Time');
        if (!newTrip.arrivalTime) missingFields.push('Arrival Time');
        if (!newTrip.seats) missingFields.push('Seats');
        if (!newTrip.price) missingFields.push('Price');
    
        if (missingFields.length > 0) {
            alert(`Please fill in the following required fields:\n${missingFields.join('\n')}`);
            return;
        }

        const tripData: Trip = {
            departure: newTrip.departure.trim(),
            arrival: newTrip.arrival.trim(),
            date: new Date(newTrip.date).toISOString().split('T')[0],
            time: newTrip.time,
            arrivalTime: newTrip.arrivalTime,
            seats: parseInt(newTrip.seats),
            price: parseFloat(newTrip.price),
            driver: user._id, // Use the verified user ID
            passengers: []
        };

        console.log('Sending trip data to server:', tripData);

        const response = await createTrip(tripData);
        console.log('Server response:', response);

        if (response) {
            alert('Trip created successfully!');
            setNewTrip({
                departure: '',
                arrival: '',
                date: '',
                time: '',
                arrivalTime: '',
                seats: '',
                price: '',
            });
            const updatedTrips = await getAllTrips();
            setTrips(updatedTrips);
        }
    } catch (error: any) {
        console.error('Error creating trip:', error);
        const errorMessage = error.response?.data?.message || 'Failed to create trip. Please check the input and try again.';
        alert(errorMessage);
    }
};

    const handleDeleteTrip = async (id: string) => {
        try {
            const confirmDelete = window.confirm('Are you sure you want to delete this trip?');
            if (!confirmDelete) return;

            console.log('Deleting trip with ID:', id);
            await deleteTrip(id);
            alert('Trip deleted successfully!');
            const updatedTrips = trips.filter(trip => trip._id !== id);
            console.log('Updated trips after deletion:', updatedTrips);
            setTrips(updatedTrips);
        } catch (error) {
            console.error('Error deleting trip:', error);
            alert('Failed to delete trip. Please try again.');
        }
    };

    const handleEditTrip = (trip: Trip) => {
        console.log('Editing trip:', trip);
        setEditingTrip(trip);
        setNewTrip({
            departure: trip.departure,
            arrival: trip.arrival,
            date: trip.date,
            time: trip.time,
            arrivalTime: trip.arrivalTime,
            seats: String(trip.seats),
            price: String(trip.price),
        });
    };

    const handleUpdateTrip = async () => {
        try {
            if (!editingTrip?._id) return;

            const updatedTrip: Trip = {
                departure: newTrip.departure.trim(),
                arrival: newTrip.arrival.trim(),
                date: new Date(newTrip.date).toISOString().split('T')[0],
                time: newTrip.time,
                arrivalTime: newTrip.arrivalTime,
                seats: parseInt(newTrip.seats),
                price: parseFloat(newTrip.price),
                driver: user!._id,
                passengers: editingTrip.passengers || []
            };

            console.log('Updating trip with ID:', editingTrip._id);
            console.log('Updated trip data:', updatedTrip);
            
            await updateTrip(editingTrip._id, updatedTrip);
            alert('Trip updated successfully!');
            setEditingTrip(null);
            setNewTrip({
                departure: '',
                arrival: '',
                date: '',
                time: '',
                arrivalTime: '',
                seats: '',
                price: '',
            });
            const updatedTrips = await getAllTrips();
            console.log('Updated trips after update:', updatedTrips);
            setTrips(updatedTrips);
        } catch (error) {
            console.error('Error updating trip:', error);
            alert('Failed to update trip. Please try again.');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold mb-8 text-blue-500">Trip Management</h1>

            {/* Create or Edit Trip Form */}
            <div className="w-full max-w-2xl mb-8">
                <h2 className="text-2xl font-semibold mb-4">
                    {editingTrip ? 'Edit Trip' : 'Create a New Trip'}
                </h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <input
                        type="text"
                        placeholder="Departure"
                        value={newTrip.departure}
                        onChange={(e) => setNewTrip({ ...newTrip, departure: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Arrival"
                        value={newTrip.arrival}
                        onChange={(e) => setNewTrip({ ...newTrip, arrival: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="date"
                        value={newTrip.date}
                        onChange={(e) => setNewTrip({ ...newTrip, date: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="time"
                        placeholder="Departure Time"
                        value={newTrip.time}
                        onChange={(e) => setNewTrip({ ...newTrip, time: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="time"
                        placeholder="Arrival Time"
                        value={newTrip.arrivalTime}
                        onChange={(e) => setNewTrip({ ...newTrip, arrivalTime: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Seats"
                        value={newTrip.seats}
                        onChange={(e) => setNewTrip({ ...newTrip, seats: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="number"
                        placeholder="Price"
                        value={newTrip.price}
                        onChange={(e) => setNewTrip({ ...newTrip, price: e.target.value })}
                        className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min="0"
                        step="0.01"
                    />
                    {editingTrip ? (
                        <div className="flex space-x-4">
                            <button
                                onClick={handleUpdateTrip}
                                className="flex-1 bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition duration-200"
                            >
                                Update Trip
                            </button>
                            <button
                                onClick={() => {
                                    setEditingTrip(null);
                                    setNewTrip({
                                        departure: '',
                                        arrival: '',
                                        date: '',
                                        time: '',
                                        arrivalTime: '',
                                        seats: '',
                                        price: '',
                                    });
                                }}
                                className="flex-1 bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleCreateTrip}
                            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200"
                        >
                            Create Trip
                        </button>
                    )}
                </div>
            </div>

            {/* List of Trips */}
            <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Your Trips</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {trips.length > 0 ? (
                        <ul className="space-y-4">
                            {trips.map((trip) => (
                                <li key={trip._id || trip.id} className="p-4 border border-gray-300 rounded-lg">
                                    <p className="text-lg font-semibold">
                                        {trip.departure} → {trip.arrival}
                                    </p>
                                    <p className="text-gray-600">
                                        Date: {trip.date} | Time: {trip.time} - {trip.arrivalTime}
                                    </p>
                                    <p className="text-gray-600">
                                        Seats: {trip.seats} | Price: ${trip.price}
                                    </p>
                                    <div className="flex space-x-4 mt-4">
                                        <button
                                            onClick={() => handleEditTrip(trip)}
                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTrip(trip._id || trip.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No trips available.</p>
                    )}
                </div>
            </div>
        </div>
    );
}