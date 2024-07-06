"use client";
import React, { useEffect, useState } from 'react';
import UserProfile from './components/UserProfile';
import NewsFeed from './components/NewsFeed';

const HomePage = () => {
  const [user, setUser] = useState(null);
  const [newsfeed, setNewsFeed] = useState([]);
  const [userId, setUserId] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await fetch(`${BASE_URL}/api/users/status`, {
          credentials: 'include',
        });
        const sessionData = await sessionRes.json();

        if (sessionData.loggedIn) {
          const userId = sessionData.user_id;
          setUserId(userId);

          const userRes = await fetch(`${BASE_URL}/api/users/${userId}`, {
            credentials: 'include',
          });
          const userData = await userRes.json();
          setUser(userData);

          const newsRes = await fetch(`${BASE_URL}/api/newsfeeds/${userId}?page=1&per_page=10`, {
            credentials: 'include',
          });
          const newsData = await newsRes.json();
          setNewsFeed(newsData.articles);
        } else {
          // Handle not logged in state, redirect to login, etc.
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [ BASE_URL]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center">
      <main className="w-full max-w-3xl p-4">
        {newsfeed.length > 0 ? (
          <NewsFeed articles={newsfeed} />
        ) : (
          <p>No news available</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
