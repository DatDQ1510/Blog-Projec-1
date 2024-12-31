import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Để lấy slug từ URL
import { Card } from 'flowbite-react';
import Comment from '../components/Comment'; // Import Comment component

export default function PostDetail() {
    const { slug } = useParams(); // Lấy slug từ URL params
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`/api/post/getpostbyslug/${slug}`);
                const data = await res.json();
                if (res.ok) {
                    setPost(data.post);

                    setComments(data.post.comments || []);
                } else {
                    setError(data.message || 'Failed to fetch post');
                }
            } catch (error) {
                setError('Something went wrong while fetching the post');
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [slug]); // Dùng slug làm dependency
   
    const handleCommentSubmit = async () => {
        if (!comment.trim()) return;

        try {
            const res = await fetch(`/api/post/addcomment/${slug}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: comment }),
            });

            if (res.ok) {
                const newComment = await res.json();
                setComments((prevComments) => [...prevComments, newComment]);
                setComment('');
            } else {
                console.error('Failed to add comment');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="min-h-screen flex flex-col p-6 bg-gray-50">
            <div className="flex-grow">
                <Card className="w-full bg-white shadow-xl rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
                    <div className="text-gray-500 mb-4 text-center">
                        <p>Category: {post.category}</p>
                        <p>Published on: {new Date(post.createdAt).toLocaleDateString()}</p>
                    </div>
                    {post.image && (
                        <img
                            src={post.image}
                            alt={post.title}
                            className="max-w-[800px] mx-auto object-cover mb-6 rounded-lg"
                        />
                    )}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </Card>

                {/* Comments Section */}
                <div className="mt-6">
                    <Comment postId={post._id} /> {/* Truyền postId vào Comment component */}
                </div>
            </div>

            {/* Footer */}
            <footer className="mt-6 text-center text-gray-500">
                &copy; 2024 Your Blog. All rights reserved.
            </footer>
        </div>
    );
}
