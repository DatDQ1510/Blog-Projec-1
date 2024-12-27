import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, Textarea, Button } from 'flowbite-react'; // Import Flowbite React

export default function PostDetail() {
    const { slug } = useParams();
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
    }, [slug]);

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
        <div className="container mx-auto py-8">
            {/* Post Content */}
            <Card className="mx-auto max-w-3xl">
                <h1 className="text-3xl font-bold mb-4 text-center">{post.title}</h1>
                <div className="text-gray-500 mb-4 text-center">
                    <p>Category: {post.category}</p>
                    <p>Published on: {new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
                {post.image && (
                    <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-auto object-cover mb-6 rounded-lg"
                    />
                )}
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </Card>

            {/* Comments Section */}
            <div className="mt-12">
                <h2 className="text-2xl font-bold text-center mb-6">Comments</h2>
                <div className="max-w-3xl mx-auto">
                    {/* Comment List */}
                    {comments.length > 0 ? (
                        comments.map((comment, index) => (
                            <Card
                                key={index}
                                className="mb-4 bg-gray-100 rounded-lg shadow-md"
                            >
                                <p>{comment.content}</p>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center">No comments yet. Be the first to comment!</p>
                    )}

                    {/* Comment Form */}
                    <Card className="mt-6 p-4">
                        <Textarea
                            className="mb-4"
                            placeholder="Write your comment here..."
                            rows={4}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                        <Button
                            className="w-full"
                            onClick={handleCommentSubmit}
                            color="blue"
                        >
                            Submit Comment
                        </Button>
                    </Card>
                </div>
            </div>
        </div>
    );
}
