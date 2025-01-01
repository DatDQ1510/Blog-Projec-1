import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function Home() {
    const { loading, userInfo, isLoggedIn } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [isFetching, setIsFetching] = useState(false);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const POSTS_PER_PAGE = 9; // Số bài viết trên mỗi trang

    useEffect(() => {
        const fetchPosts = async () => {
            setIsFetching(true);
            setError(null);

            try {
                const res = await fetch(`/api/post/getposts?startIndex=${(currentPage - 1) * POSTS_PER_PAGE}&limit=${POSTS_PER_PAGE}`);
                const data = await res.json();

                if (res.ok) {
                    setPosts(data.posts);
                    setTotalPages(Math.ceil(data.totalPosts / POSTS_PER_PAGE)); // Tính tổng số trang
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
    }, [currentPage]);

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
                            key={post.slug}
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

            {/* Pagination */}
            <div className="flex justify-center items-center mt-8 space-x-4">
                <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-300`}
                >
                    Previous
                </button>
                <span className="text-lg font-semibold">
                    Page {currentPage} of {totalPages}
                </span>
                <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-300' : 'bg-blue-600 text-white hover:bg-blue-700'} transition-all duration-300`}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
