'use client';
import React from "react";
import Link from "next/link";

export default function Page() {
    return (
        <div>
            <h1>Page</h1>
            <Link href="/login">
                <button>Login</button>
            </Link>
            <Link href="/register">
                <button>Register</button>
            </Link>
        </div>
    );
}