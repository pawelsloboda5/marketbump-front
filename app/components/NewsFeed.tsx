"use client";
import React, { useState, useEffect, useCallback } from 'react';
import Article from './Article';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

interface ArticleProps {
    _id: string;
    title: string;
    description: string;
    author: string;
    article_url: string;
    published_utc: string;
    likes: { length: number };
    comments: { length: number };
}

export default function NewsFeed({ articles: initialArticles }: { articles: ArticleProps[] }) {
    const [articles, setArticles] = useState<ArticleProps[]>(initialArticles);
    const [userId, setUserId] = useState<string | null>(null);
    const [likedArticles, setLikedArticles] = useState<string[]>([]);
    const [favoritedArticles, setFavoritedArticles] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const fetchMoreArticles = useCallback(async () => {
        if (!userId) return;
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        try {
            const response = await fetch(`${BASE_URL}/api/newsfeeds/${userId}?page=${page + 1}&per_page=10`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            });
            const data = await response.json();
            if (data && data.articles) {
                setArticles(prevArticles => [...prevArticles, ...data.articles]);
                setHasMore(data.has_more);
                setPage(prevPage => prevPage + 1);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error fetching more articles:', error);
            setHasMore(false);
        }
    }, [page, userId, BASE_URL]);

    const { bottomRef, isFetching } = useInfiniteScroll(fetchMoreArticles);

    useEffect(() => {
        const fetchUserSession = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;
            try {
                const response = await fetch(`${BASE_URL}/api/users/status`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (data.user_id) {
                    const userId = data.user_id;
                    setUserId(userId);
                    fetchLikedArticles(userId, token);
                    fetchFavoritedArticles(userId, token);
                    fetchInitialArticles(userId, token);
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
            }
        };

        const fetchLikedArticles = async (userId: string, token: string) => {
            try {
                const response = await fetch(`${BASE_URL}/api/users/${userId}/liked_articles`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                const likedArticleIds = data.map((article: any) => article._id);
                setLikedArticles(likedArticleIds);
            } catch (error) {
                console.error('Error fetching liked articles:', error);
            }
        };

        const fetchFavoritedArticles = async (userId: string, token: string) => {
            try {
                const response = await fetch(`${BASE_URL}/api/users/${userId}/favorited_articles`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                const favoritedArticleIds = data.map((article: any) => article._id);
                setFavoritedArticles(favoritedArticleIds);
            } catch (error) {
                console.error('Error fetching favorited articles:', error);
            }
        };

        const fetchInitialArticles = async (userId: string, token: string) => {
            try {
                const response = await fetch(`${BASE_URL}/api/newsfeeds/${userId}?page=1&per_page=10`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                });
                const data = await response.json();
                if (data && data.articles) {
                    setArticles(data.articles);
                    setHasMore(data.has_more);
                } else {
                    setHasMore(false);
                }
            } catch (error) {
                console.error('Error fetching initial articles:', error);
            }
        };

        fetchUserSession();
    }, [BASE_URL]);

    if (!userId) {
        return <p>Loading...</p>;
    }

    return (
        <div className="space-y-4">
            {articles.map((article, index) => (
                <React.Fragment key={article._id}>
                    <Article
                        article={article}
                        userId={userId}
                        likedArticles={likedArticles}
                        setLikedArticles={setLikedArticles}
                        favoritedArticles={favoritedArticles}
                        setFavoritedArticles={setFavoritedArticles}
                    />
                    {index < articles.length - 1 && (
                        <hr className="border-t border-gray-600 my-4" />
                    )}
                </React.Fragment>
            ))}
            <div ref={bottomRef} className="loading-indicator">
                {isFetching && hasMore && 'Loading more articles...'}
            </div>
        </div>
    );
}
