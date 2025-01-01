import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Table, Button, Pagination } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';

export default function UserEdit() {
    const { userInfo } = useContext(AuthContext);
    const [userPosts, setUserPosts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Add error state
    const postsPerPage = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!userInfo || !userInfo.id) return;

            setLoading(true);
            setError(null);

            try {
                const url = `/api/post/getposts?userId=${userInfo.id}`;
                const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = await res.json();
                if (res.ok) {
                    setUserPosts(data.posts || []);
                } else {
                    setError(data.message || 'Failed to fetch posts.');
                }
            } catch (error) {
                setError('An error occurred while fetching posts.');
                console.error('Fetch error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [userInfo]);

    const handleDelete = async (postId) => {
        if (window.confirm('Bạn có chắc muốn xóa bài viết này?')) {
            try {
                const res = await fetch(`/api/post/deletepost/${postId}/${userInfo.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (res.ok) {
                    setUserPosts((prevPosts) =>
                        prevPosts.filter((post) => post._id !== postId)
                    );
                    alert('Bài viết đã được xóa thành công');
                } else {
                    const data = await res.json();
                    alert(data.message || 'Failed to delete post');
                }
            } catch (error) {
                alert('Có lỗi xảy ra trong quá trình xóa bài viết');
                console.error('Delete error:', error);
            }
        }
    };

    const handleUpdate = (slug) => {
        navigate(`/update-post/${slug}`);
    };

    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = userPosts.slice(startIndex, startIndex + postsPerPage);

    if (!userInfo) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">Đang tải thông tin người dùng...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8">
            <h1 className="text-2xl mb-12 text-center text-red-700">My list posts</h1>

            {loading ? (
                <p className="text-center text-gray-500">Loading posts...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : userPosts.length === 0 ? (
                <p className="text-center text-gray-500">No posts found.</p>
            ) : (
                <>
                    {/* Hiển thị số lượng bài viết */}
                    <div className="mb-12 text-center">
                        <p className="text-lg font-semibold">Total Posts: {userPosts.length}</p>
                    </div>

                    <Table hoverable={true}>
                        <Table.Head>
                            <Table.HeadCell>Image</Table.HeadCell>
                            <Table.HeadCell>Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                            <Table.HeadCell>Date</Table.HeadCell>
                            <Table.HeadCell>Action</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className="divide-y">
                            {currentPosts.map((post) => (
                                <Table.Row key={post.slug} className="bg-white">
                                    <Table.Cell>
                                        <img
                                            src={post.image}
                                            alt={post.title}
                                            className="w-20 h-14 object-cover rounded-md"
                                        />
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            to={`/post/${post.slug}`}
                                            className="text-blue-600 hover:underline"
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>{post.updatedAt}</Table.Cell>
                                    <Table.Cell>
                                        <div className="flex space-x-2">
                                            <Button
                                                className="bg-blue-500 hover:bg-blue-700"
                                                onClick={() => handleUpdate(post.slug)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                className="bg-red-500 hover:bg-red-700"
                                                onClick={() => handleDelete(post._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    <div className="mt-4 flex justify-end">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={Math.ceil(userPosts.length / postsPerPage)}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </>
            )}
        </div>
    );
}
