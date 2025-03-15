'use client';

import React, { useState } from 'react';
import api from '../utils/api';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [role, setRole] = useState('passenger');

    const handleRegister = async () => {
        try {
            const endpoint = role === 'driver' ? '/drivers' : '/passengers';
            await api.post(endpoint, {
                email,
                password,
                passwordConfirmation,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>Register</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password confirmation"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="passenger">Passenger</option>
                <option value="driver">Driver</option>
            </select>
            <button onClick={handleRegister}>Register</button>
        </div>
    );
}