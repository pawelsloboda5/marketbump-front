"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const LoginForm = ({ onRegisterClick }: { onRegisterClick: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await fetch(`${BASE_URL}/api/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                console.log('Login successful');
                const sessionStatus = await checkSession();
                if (sessionStatus) {
                    router.push('/user-profile');
                } else {
                    console.log('Session not logged in');
                }
            } else {
                console.log('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const checkSession = async () => {
        const response = await fetch(`${BASE_URL}/api/users/status`, {
            credentials: 'include',
        });
        const data = await response.json();
        console.log('Session status:', data);
        return data.loggedIn;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-white">
            <div className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-sm">
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">Login</button>
                </form>
                <div className="mt-4 text-center">
                    <span className="text-sm text-gray-400">Don&#39;t have an account?</span>
                    <button onClick={onRegisterClick} className="text-blue-400 hover:underline ml-1">Register</button>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
