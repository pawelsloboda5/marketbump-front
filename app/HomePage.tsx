"use client";

import React, { useEffect, useState } from 'react';
import NewsFeed from './components/NewsFeed';

const HomePage = () => {
  const [newsfeed, setNewsFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user status to get user_id
        const sessionRes = await fetch(`${BASE_URL}/api/users/get_user_status`, {
          credentials: 'include',
        });

        if (!sessionRes.ok) {
          throw new Error(`HTTP error! status: ${sessionRes.status}`);
        }

        const sessionData = await sessionRes.json();

        if (sessionData.loggedIn) {
          const userId = sessionData.user_id;

          // Fetch user-specific news feed
          const newsRes = await fetch(`${BASE_URL}/api/newsfeeds/${userId}`, {
            credentials: 'include',
          });

          if (!newsRes.ok) {
            throw new Error(`HTTP error! status: ${newsRes.status}`);
          }

          const newsData = await newsRes.json();
          setNewsFeed(newsData.articles || []);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [BASE_URL]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="bg-transparent text-white min-h-screen flex flex-col items-center">
      <main className="w-full max-w-3xl p-4">
        {Array.isArray(newsfeed) && newsfeed.length > 0 ? (
          <NewsFeed articles={newsfeed} />
        ) : (
          <p>No news available</p>
        )}
      </main>
    </div>
  );
};

export default HomePage;
