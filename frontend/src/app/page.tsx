'use client';

import React, { useEffect, useState } from 'react';
import { getAllTrips } from './utils/api';
import Link from 'next/link';
import './globals.css';

export default function Page() {
    const [trips, setTrips] = useState([]);
    const [filteredTrips, setFilteredTrips] = useState([]);
    const [departure, setDeparture] = useState('');
    const [arrival, setArrival] = useState('');

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const data = await getAllTrips();
                setTrips(data);
                setFilteredTrips(data);
            } catch (error) {
                console.error('Error fetching trips:', error);
            }
        };

        fetchTrips();
    }, []);

    const handleSearch = () => {
        const filtered = trips.filter(
            (trip) =>
                trip.departure.toLowerCase().includes(departure.toLowerCase()) &&
                trip.arrival.toLowerCase().includes(arrival.toLowerCase())
        );
        setFilteredTrips(filtered);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold mb-8 text-blue-500">Find Your Ride</h1>
            <div className="w-full max-w-2xl mb-6">
                <div className="flex space-x-4 mb-4">
                    <input
                        type="text"
                        placeholder="Departure"
                        value={departure}
                        onChange={(e) => setDeparture(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                        type="text"
                        placeholder="Arrival"
                        value={arrival}
                        onChange={(e) => setArrival(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
                    >
                        Search
                    </button>
                </div>
            </div>
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                {filteredTrips.length > 0 ? (
                    <ul className="space-y-4">
                        {filteredTrips.map((trip) => (
                            <li
                                key={trip._id || trip.id}
                                className="p-4 border border-gray-300 rounded-lg"
                            >
                                <Link href={`/trip?id=${trip._id || trip.id}`}>
                                    <p className="text-lg font-semibold cursor-pointer hover:underline">
                                        {trip.departure} → {trip.arrival}
                                    </p>
                                </Link>
                                <p className="text-gray-600">
                                    Date: {trip.date} | Price: ${trip.price}
                                </p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600">No trips available.</p>
                )}
            </div>
        </div>
    );
}