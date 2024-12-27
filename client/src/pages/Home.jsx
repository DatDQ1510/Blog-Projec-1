import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
    const { loading, userInfo, isLoggedIn } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await fetch('/api/post/getposts');
                const data = await res.json();

                if (res.ok) {
                    setPosts(data.posts);
                } else {
                    setError(data.message || 'Failed to fetch posts');
                }
            } catch (error) {
                setError('Something went wrong while fetching posts');
                console.error(error);
            } finally {
                setIsFetching(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn || !userInfo) {
        return <h1>Please log in.</h1>;
    }

    if (isFetching) {
        return <div>Fetching posts...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl font-bold mb-6 text-center">Welcome, {userInfo.username}!</h1>
            <h2 className="text-xl mb-4 text-center">Danh sách bài viết:</h2>

            {posts.length === 0 ? (
                <p className="text-center">Không có bài viết nào.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts.map((post) => (
                        <div
                            key={post.id}
                            className="relative group hover:shadow-lg transition-shadow duration-300 border border-gray-200 rounded-lg overflow-hidden"
                        >
                            {/* Thumbnails */}
                            {post.image && (
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full object-cover h-48"
                                />
                            )}

                            {/* Nội dung */}
                            <div className="p-4">
                                <h5 className="text-lg font-semibold tracking-tight text-gray-900">
                                    {post.title}
                                </h5>
                                <p className="font-normal text-gray-500">{post.category}</p>
                            </div>

                            {/* Nút "Read Article" */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <Link to={`/post/${post.slug}`}>
                                    <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 hover:px-8">
                                        Read article
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
