'use client';

import React, { useState } from 'react';
import api from '../utils/api';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('passenger');

    const handleLogin = async () => {
        try {
            const endpoint = role === 'driver' ? '/drivers/login' : '/passengers/login';
            const response = await api.post(endpoint, {
                email,
                password,
            });
            console.log('Login successful:', response.data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
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
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="passenger">Passenger</option>
                <option value="driver">Driver</option>
            </select>
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}