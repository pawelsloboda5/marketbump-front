"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import UserProfile from '../components/UserProfile';

const UserProfilePage = () => {
    const [user, setUser] = useState(null);
    const router = useRouter();
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(`${BASE_URL}/api/users/status`, {
                    credentials: 'include'
                });
                const data = await response.json();
                if (data.loggedIn) {
                    const userResponse = await fetch(`${BASE_URL}/api/users/${data.user_id}`, {
                        credentials: 'include'
                    });
                    const userData = await userResponse.json();
                    setUser(userData);
                } else {
                    router.push('/login'); // Redirect to login if not authenticated
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                router.push('/login'); // Redirect to login if an error occurs
            }
        };

        fetchUser();
    }, [router, BASE_URL]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <UserProfile user={user} />
        </div>
    );
};

export default UserProfilePage;
