"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { formatTime } from '../utils/timeUtils';
import LikeIcon from '../icons/LikeIcon';
import LikesIconFilled from '../icons/LikesIconFilled';
import FavoriteIcon from '../icons/FavoriteIcon';
import CommentIcon from '../icons/CommentIcon';
import ContinueIcon from '../icons/ContinueIcon';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface Comment {
    user_id: string;
    quote: string;
    username?: string; // Adding username to Comment interface
}

interface ArticleProps {
    article: {
        _id: string;
        title: string;
        description: string;
        author: string;
        article_url: string;
        published_utc: string;
        likes: { length: number };
        comments: { length: number };
    };
    userId: string;
    likedArticles: string[];
    setLikedArticles: React.Dispatch<React.SetStateAction<string[]>>;
    favoritedArticles: string[];
    setFavoritedArticles: React.Dispatch<React.SetStateAction<string[]>>;
}

const Article: React.FC<ArticleProps> = ({ article, userId, likedArticles, setLikedArticles, favoritedArticles, setFavoritedArticles }) => {
    const [commentedArticles, setCommentedArticles] = useState<{ [key: string]: Comment[] }>({ [article._id]: [] });
    const [commentInput, setCommentInput] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [likeCount, setLikeCount] = useState(article.likes.length);
    const [userDetails, setUserDetails] = useState<{ [key: string]: string }>({});

    const fetchComments = useCallback(async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}/comments`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await response.json();
        setCommentedArticles(prevComments => ({ ...prevComments, [article._id]: data }));

        // Fetch user details for each comment
        const userIds = data.map((comment: Comment) => comment.user_id);
        await fetchUserDetails(userIds);
    }, [article._id]);

    const fetchUserDetails = async (userIds: string[]) => {
        const uniqueUserIds = Array.from(new Set(userIds));
        const userDetailsPromises = uniqueUserIds.map(async (userId) => {
            const response = await fetch(`${BASE_URL}/api/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
            });
            const userData = await response.json();
            return { userId, username: userData.username };
        });
        const userDetailsArray = await Promise.all(userDetailsPromises);
        const userDetailsObject = userDetailsArray.reduce((acc, userDetail) => {
            acc[userDetail.userId] = userDetail.username;
            return acc;
        }, {} as { [key: string]: string });
        setUserDetails(prevUserDetails => ({ ...prevUserDetails, ...userDetailsObject }));
    };

    const fetchLikeCount = useCallback(async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
        });
        const data = await response.json();
        setLikeCount(data.likes_count);
    }, [article._id]);

    useEffect(() => {
        fetchComments();
        fetchLikeCount();
    }, [fetchComments, fetchLikeCount]);

    const handleLike = async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}/like`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
            setLikedArticles([...likedArticles, article._id]);
            fetchLikeCount();
        }
    };

    const handleFavorite = async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}/favorite`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
            setFavoritedArticles([...favoritedArticles, article._id]);
        }
    };

    const handleComment = async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}/quote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
            },
            body: JSON.stringify({ user_id: userId, quote: commentInput }),
        });

        if (response.ok) {
            setCommentedArticles(prevComments => ({
                ...prevComments,
                [article._id]: [...(prevComments[article._id] || []), { user_id: userId, quote: commentInput, username: userDetails[userId] }]
            }));
            setCommentInput('');
        }
    };

    const toggleComments = () => {
        if (showComments) {
            setShowComments(false);
        } else {
            fetchComments();
            setShowComments(true);
        }
    };

    return (
        <div className="bg-background-secondary p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">{article.author}</span>
                <span className="text-gray-400">{formatTime(article.published_utc)}</span>
            </div>
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p>{article.description}</p>
            <a href={article.article_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
                <ContinueIcon />
            </a>
            <div className="flex gap-1 mt-2">
                <button
                    className={`flex items-center px-2 py-1 rounded-xl ${likedArticles.includes(article._id) ? 'text-red-500' : 'text-gray-400 hover:bg-gray-800'}`}
                    onClick={handleLike}
                >
                    <LikeIcon />
                    <span className="ml-1">{likeCount}</span>  {/* Display like count */}
                </button>
                <button
                    className={`flex items-center px-2 py-1 rounded-xl ${showComments ? 'text-red-500' : 'text-gray-400 hover:bg-gray-800'}`}
                    onClick={toggleComments}
                >
                    <CommentIcon />
                    <span className="ml-1">{commentedArticles[article._id] ? commentedArticles[article._id].length : 0}</span>
                </button>
                <button
                    className={`flex items-center px-2 py-1 rounded-xl ${favoritedArticles.includes(article._id) ? 'text-red-500' : 'text-gray-400 hover:bg-gray-800'}`}
                    onClick={handleFavorite}
                >
                    <FavoriteIcon />
                </button>
            </div>
            {showComments && (
                <div className="mt-2">
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment"
                        className="w-full px-3 py-2 bg-gray-800 text-white border border-gray-600 rounded-md"
                    />
                    <button
                        onClick={handleComment}
                        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 mt-2"
                    >
                        Submit
                    </button>
                    <button
                        onClick={toggleComments}
                        className="w-full bg-gray-600 text-white py-2 rounded-md hover:bg-gray-700 mt-2"
                    >
                        Cancel
                    </button>
                    <div className="mt-2 space-y-2">
                        {commentedArticles[article._id]?.map((comment, idx) => (
                            <div key={idx} className="bg-gray-800 p-2 rounded-md">
                                <strong>{userDetails[comment.user_id] || 'Unknown User'}:</strong> {comment.quote}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Article;
