'use client';

import React, { useEffect, useState } from 'react';
import { getAllTrips, cancelTrip } from '../utils/api';
import '../globals.css';

function combineDateAndTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

export default function Profile() {
    const [user, setUser] = useState(null);
    const [tripHistory, setTripHistory] = useState([]);
    const [upcomingTrips, setUpcomingTrips] = useState([]);
    const [currentTrips, setCurrentTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
            }
        }
    }, []);

    useEffect(() => {
        if (!user) return;

        const fetchTrips = async () => {
            try {
                const allTrips = await getAllTrips();
                const now = new Date();

                const history = [];
                const upcoming = [];
                const current = [];

                allTrips.forEach((trip) => {
                    const isDriver = trip.driver === user._id;
                    const isPassenger = Array.isArray(trip.passengers) && trip.passengers.some(
                        (p) => (typeof p === 'string' ? p === user._id : p._id === user._id)
                    );
                    if (!isDriver && !isPassenger) return;

                    const departureDateTime = combineDateAndTime(trip.date, trip.time);
                    const arrivalDateTime = combineDateAndTime(trip.date, trip.arrivalTime);

                    if (now < departureDateTime) {
                        upcoming.push(trip);
                    } else if (now >= departureDateTime && now <= arrivalDateTime) {
                        current.push(trip);
                    } else {
                        history.push(trip);
                    }
                });

                setTripHistory(history);
                setUpcomingTrips(upcoming);
                setCurrentTrips(current);
            } catch (error) {
                console.error('Error fetching trips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTrips();
    }, [user]);

    function canCancelTrip(trip) {
        const departureDateTime = combineDateAndTime(trip.date, trip.time);
        const now = new Date();
        return departureDateTime.getTime() - now.getTime() > 600000;
    }

    const handleCancelTrip = async (tripId) => {
        try {
            await cancelTrip(tripId, user._id);
            alert('Booking canceled!');
            // Refresh and re-sort trips
            const allTrips = await getAllTrips();
            const now = new Date();

            const history = [];
            const upcoming = [];
            const current = [];

            allTrips.forEach((trip) => {
                const isDriver = trip.driver === user._id;
                const isPassenger = Array.isArray(trip.passengers) && trip.passengers.some(
                    (p) => (typeof p === 'string' ? p === user._id : p._id === user._id)
                );
                if (!isDriver && !isPassenger) return;

                const departureDateTime = combineDateAndTime(trip.date, trip.time);
                const arrivalDateTime = combineDateAndTime(trip.date, trip.arrivalTime);

                if (now < departureDateTime) {
                    upcoming.push(trip);
                } else if (now >= departureDateTime && now <= arrivalDateTime) {
                    current.push(trip);
                } else {
                    history.push(trip);
                }
            });

            setTripHistory(history);
            setUpcomingTrips(upcoming);
            setCurrentTrips(current);
        } catch (error) {
            alert('Failed to cancel booking.');
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (!user) {
        return <div className="flex items-center justify-center min-h-screen">User not found. Please log in again.</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold mb-8 text-blue-500">Your Trips</h1>

            {/* Current Trips */}
            <div className="w-full max-w-2xl mb-8">
                <h2 className="text-2xl font-semibold mb-4">Current Trips</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {currentTrips.length > 0 ? (
                        <ul className="space-y-4">
                            {currentTrips.map((trip) => {
                                const isPassenger = Array.isArray(trip.passengers) && trip.passengers.some(
                                    (p) => (typeof p === 'string' ? p === user._id : p._id === user._id)
                                );
                                return (
                                    <li key={trip._id || trip.id} className="p-4 border border-gray-300 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {trip.departure} → {trip.arrival}
                                            </p>
                                            <p className="text-gray-600">
                                                Date: {trip.date} | Time: {trip.time} - {trip.arrivalTime}
                                            </p>
                                            <p className="text-gray-600">Price: ${trip.price}</p>
                                        </div>
                                        {(isPassenger && canCancelTrip(trip)) && (
                                            <button
                                                onClick={() => handleCancelTrip(trip._id)}
                                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No current trips.</p>
                    )}
                </div>
            </div>

            {/* Upcoming Trips */}
            <div className="w-full max-w-2xl mb-8">
                <h2 className="text-2xl font-semibold mb-4">Upcoming Trips</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {upcomingTrips.length > 0 ? (
                        <ul className="space-y-4">
                            {upcomingTrips.map((trip) => {
                                const isPassenger = Array.isArray(trip.passengers) && trip.passengers.some(
                                    (p) => (typeof p === 'string' ? p === user._id : p._id === user._id)
                                );
                                return (
                                    <li key={trip._id || trip.id} className="p-4 border border-gray-300 rounded-lg flex items-center justify-between">
                                        <div>
                                            <p className="text-lg font-semibold">
                                                {trip.departure} → {trip.arrival}
                                            </p>
                                            <p className="text-gray-600">
                                                Date: {trip.date} | Time: {trip.time}
                                            </p>
                                            <p className="text-gray-600">Price: ${trip.price}</p>
                                        </div>
                                        {(isPassenger && canCancelTrip(trip)) && (
                                            <button
                                                onClick={() => handleCancelTrip(trip._id)}
                                                className="ml-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No upcoming trips.</p>
                    )}
                </div>
            </div>

            {/* Past Trips */}
            <div className="w-full max-w-2xl">
                <h2 className="text-2xl font-semibold mb-4">Past Trips</h2>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    {tripHistory.length > 0 ? (
                        <ul className="space-y-4">
                            {tripHistory.map((trip) => (
                                <li key={trip._id || trip.id} className="p-4 border border-gray-300 rounded-lg">
                                    <p className="text-lg font-semibold">
                                        {trip.departure} → {trip.arrival}
                                    </p>
                                    <p className="text-gray-600">
                                        Date: {trip.date} | Time: {trip.time} - {trip.arrivalTime}
                                    </p>
                                    <p className="text-gray-600">Price: ${trip.price}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-600">No past trips.</p>
                    )}
                </div>
            </div>
        </div>
    );
}