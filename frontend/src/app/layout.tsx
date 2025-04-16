'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './globals.css';

export default function Layout({ children }) {
    const router = useRouter();
    const [user, setUser] = useState(null);

    const loadUser = () => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error parsing user data from localStorage:', error);
                setUser(null);
            }
        }
    };

    useEffect(() => {
        loadUser();
        const handleUserLogin = () => {
            loadUser();
        };
        window.addEventListener('user-login', handleUserLogin);
        return () => {
            window.removeEventListener('user-login', handleUserLogin);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        router.push('/');
    };

    return (
        <html lang="en">
            <body className="bg-gray-100">
                <header className="bg-white shadow-md">
                    <div className="container mx-auto flex justify-between items-center p-4">
                        <Link href="/">
                            <h1 className="text-2xl font-bold text-blue-500 cursor-pointer">CovoitLocal</h1>
                        </Link>
                        <div className="flex space-x-4">
                            {!user ? (
                                <>
                                    <Link href="/login">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                                            Login
                                        </button>
                                    </Link>
                                    <Link href="/register">
                                        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-200">
                                            Register
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <p className="text-gray-700 font-semibold">
                                        Welcome, {user.name}
                                    </p>
                                    <Link href="/profile">
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200">
                                            Profile
                                        </button>
                                    </Link>
                                    {user.role === 'driver' && (
                                        <Link href="/gestion">
                                            <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200">
                                                Gestion
                                            </button>
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
                                    >
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>
                <main className="container mx-auto p-4">{children}</main>
                <footer className="bg-gray-800 text-white py-4">
                    <div className="container mx-auto text-center">
                        <p>&copy; 2025 CovoitLocal. All rights reserved.</p>
                        <div className="flex justify-center space-x-4 mt-2">
                            <Link href="/about" className="hover:underline">
                                About Us
                            </Link>
                            <Link href="/contact" className="hover:underline">
                                Contact
                            </Link>
                            <Link href="/terms" className="hover:underline">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </footer>
            </body>
        </html>
    );
}