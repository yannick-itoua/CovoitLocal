'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getTrip, bookTrip } from '../utils/api';
import '../globals.css';

export default function TripPage() {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isBooked, setIsBooked] = useState(false);
    const [user, setUser] = useState(null);

    const searchParams = useSearchParams();
    const tripId = searchParams.get('id');
    const router = useRouter();

    // Helper to check if user is already booked
    const checkIsBooked = (tripData, userData) => {
        if (!tripData || !userData) return false;
        return Array.isArray(tripData.passengers) && tripData.passengers.some(
            (p) => (typeof p === 'string' ? p === userData._id : p._id === userData._id)
        );
    };

    useEffect(() => {
        // Fetch the logged-in user from localStorage
        const storedUser = localStorage.getItem('user');
        let parsedUser = null;
        if (storedUser) {
            try {
                parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUser(null);
            }
        }

        // Fetch the trip details
        const fetchTrip = async () => {
            try {
                if (!tripId) {
                    setError('Trip ID is missing.');
                    return;
                }
                const data = await getTrip(tripId);
                setTrip(data);

                // Check if the passenger has already booked the trip
                setIsBooked(checkIsBooked(data, parsedUser));
            } catch (err) {
                setError('Error fetching trip details.');
                console.error('Error fetching trip details:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrip();
        // eslint-disable-next-line
    }, [tripId]);

    const handleBookTrip = async () => {
        try {
            if (!trip || !user) return;
            // Prevent double booking on frontend as well
            if (isBooked) {
                alert('You have already booked this trip.');
                return;
            }
            await bookTrip(trip._id, user._id);
            alert('Trip booked successfully!');

            // Re-fetch trip to update seats and passengers and booking status
            const updatedTrip = await getTrip(trip._id);
            setTrip(updatedTrip);
            setIsBooked(checkIsBooked(updatedTrip, user));
        } catch (err) {
            console.error('Error booking trip:', err);
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    const handleCancelTrip = async () => {
        try {
            // Add your cancellation logic here (e.g., API call to cancel the trip)
            alert('Trip canceled successfully!');
            setIsBooked(false);
        } catch (err) {
            console.error('Error canceling trip:', err);
        }
    };

    if (!tripId) {
        return (
            <div className="flex items-center justify-center min-h-screen text-red-500">
                Trip ID is missing. Please go back and select a trip.
            </div>
        );
    }

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-500">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-3xl font-bold mb-4">Trip Details</h1>
                {trip ? (
                    <div>
                        <p className="text-lg font-semibold">
                            {trip.departure} → {trip.arrival}
                        </p>
                        <p className="text-gray-600">Date: {trip.date}</p>
                        <p className="text-gray-600">Price: ${trip.price}</p>
                        <p className="text-gray-600">Seats Available: {trip.seats}</p>
                        <div className="flex space-x-4 mt-6">
    {user ? (
        user._id === trip.driver ? (
            <p className="text-blue-500">
                You are the driver of this trip. You cannot book your own trip.
            </p>
        ) : isBooked ? (
            <p className="text-green-600">
                You have already booked this trip.
            </p>
        ) : trip.seats <= 0 ? (
            <p className="text-red-500">
                No seats available for this trip.
            </p>
        ) : (
            <button
                onClick={handleBookTrip}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200"
            >
                Book Trip
            </button>
        )
    ) : (
        <p className="text-gray-600">
            Please log in as a passenger to book this trip.
        </p>
    )}
</div>
                    </div>
                ) : (
                    <p className="text-gray-600">Trip not found.</p>
                )}
            </div>
        </div>
    );
}