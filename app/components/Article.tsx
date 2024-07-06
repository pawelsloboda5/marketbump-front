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

    const fetchComments = useCallback(async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}/comments`, {
            credentials: 'include',
        });
        const data = await response.json();
        setCommentedArticles(prevComments => ({ ...prevComments, [article._id]: data }));
    }, [article._id]);

    const fetchLikeCount = useCallback(async () => {
        const response = await fetch(`${BASE_URL}/api/articles/${article._id}`, {
            credentials: 'include',
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
            },
            credentials: 'include',
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
            },
            credentials: 'include',
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
            },
            credentials: 'include',
            body: JSON.stringify({ user_id: userId, quote: commentInput }),
        });

        if (response.ok) {
            setCommentedArticles(prevComments => ({
                ...prevComments,
                [article._id]: [...(prevComments[article._id] || []), { user_id: userId, quote: commentInput }]
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
        <div className="article-container">
            <h2>{article.title}</h2>
            <p>{article.description}</p>
            <p>By {article.author}</p>
            <p>Published on {new Date(article.published_utc).toLocaleString()}</p>
            <div>
                <button onClick={handleLike}>
                    {likedArticles.includes(article._id) ? <LikesIconFilled /> : <LikeIcon />}
                </button>
                <button onClick={handleFavorite}>
                    <FavoriteIcon />
                </button>
                <button onClick={toggleComments}>
                    <CommentIcon />
                </button>
                <span>{likeCount} likes</span>
                <span>{article.comments.length} comments</span>
            </div>
            {showComments && (
                <div className="comments-section">
                    {commentedArticles[article._id].map((comment, index) => (
                        <div key={index}>
                            <p>{comment.quote}</p>
                        </div>
                    ))}
                    <input
                        type="text"
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button onClick={handleComment}>Comment</button>
                </div>
            )}
        </div>
    );
};

export default Article;
