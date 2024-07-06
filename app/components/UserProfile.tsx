"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface UserProfileProps {
    user: {
        username: string;
        bio?: string;
        followers_count?: number;
    };
}

interface Article {
    title: string;
    description: string;
    article_url: string;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const [userData, setUserData] = useState(user);
    const [favoritedArticles, setFavoritedArticles] = useState<Article[]>([]);
    const [userId, setUserId] = useState<string | null>(null);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    // Fetch user session and favorited articles
    useEffect(() => {
        const fetchUserSession = async () => {
            const response = await fetch(`${BASE_URL}/api/users/status`, {
                credentials: 'include',
            });
            const data = await response.json();
            if (data.loggedIn) {
                setUserId(data.user_id);
                fetchFavoritedArticles(data.user_id);
            }
        };

        const fetchFavoritedArticles = async (userId: string) => {
            const response = await fetch(`${BASE_URL}/api/users/${userId}/favorites`, {
                credentials: 'include',
            });
            const data = await response.json();
            setFavoritedArticles(data);
        };

        fetchUserSession();
    }, [user,BASE_URL]);

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <div className="p-4 bg-background-primary min-h-screen">
            <div className="flex items-center justify-center mt-4">
                <Image src="https://via.placeholder.com/100" alt="User Avatar" className="rounded-full w-24 h-24" />
            </div>
            <div className="text-center mt-4">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                <p className="text-gray-500">@{user.username}</p>
                <p className="mt-2 text-gray-400">{user.bio || 'This is a placeholder bio.'}</p>
                <p className="mt-2 text-gray-400">{user.followers_count || '0'} followers</p>
            </div>
            <div className="flex justify-around mt-4">
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md">Edit profile</button>
                <button className="bg-gray-700 text-white px-4 py-2 rounded-md">Add to portfolio</button>
            </div>
            <div className="flex justify-around mt-4 border-b border-gray-700">
                <button 
                    className={`flex-1 py-2 ${activeTab === 'posts' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleTabClick('posts')}
                >
                    Posts
                </button>
                <button 
                    className={`flex-1 py-2 ${activeTab === 'quotes' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleTabClick('quotes')}
                >
                    Quotes
                </button>
                <button 
                    className={`flex-1 py-2 ${activeTab === 'favorites' ? 'border-b-2 border-white' : ''}`}
                    onClick={() => handleTabClick('favorites')}
                >
                    Favorites
                </button>
            </div>
            <div className="mt-4">
                {activeTab === 'posts' && (
                    <div className="text-white">
                        <p>Your posts will appear here.</p>
                    </div>
                )}
                {activeTab === 'quotes' && (
                    <div className="text-white">
                        <p>Your quotes will appear here.</p>
                    </div>
                )}
                {activeTab === 'favorites' && (
                    <div className="text-white">
                        {favoritedArticles.length > 0 ? (
                            favoritedArticles.map((article, index) => (
                                <div key={index} className="mb-4">
                                    <h2 className="text-xl font-bold">{article.title}</h2>
                                    <p>{article.description}</p>
                                    <a href={article.article_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                                        Read more
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p>No favorite articles found.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
