"use client";

import React, { useEffect, useState } from 'react';
import NewsFeed from './components/NewsFeed';

const HomePage = () => {
  const [newsfeed, setNewsFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        console.log('Token:', token);
        if (!token) {
          window.location.href = '/login';
          return;
        }

        const sessionRes = await fetch(`${BASE_URL}/api/users/status`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        });

        if (!sessionRes.ok) {
          throw new Error(`HTTP error! status: ${sessionRes.status}`);
        }

        const sessionData = await sessionRes.json();
        console.log('User status:', sessionData);
        if (sessionData.user_id) {
          const userId = sessionData.user_id;

          // Fetch user-specific news feed
          console.log(`Fetching newsfeed for user ${userId}...`);
          const newsRes = await fetch(`${BASE_URL}/api/newsfeeds/${userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            credentials: 'include',
          });

          if (!newsRes.ok) {
            throw new Error(`HTTP error! status: ${newsRes.status}`);
          }

          const newsData = await newsRes.json();
          console.log('Newsfeed data:', newsData);
          setNewsFeed(newsData.articles || []);
        } else {
          window.location.href = '/login';
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
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
