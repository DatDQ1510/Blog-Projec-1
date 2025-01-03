import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Table, Button, Pagination } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';

export default function DashComment() {
  const { userInfo } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const postsPerPage = 5;

  // Fetch comments from the server
  useEffect(() => {
    const fetchComments = async () => {
      if (!userInfo || !userInfo.id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/comment/get-total-comment', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setComments(data.comments || []);
        } else {
          setError(data.message || 'Failed to fetch comments.');
        }
      } catch (error) {
        setError('An error occurred while fetching comments.');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [userInfo]);

  // Handle comment deletion
  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        const res = await fetch(`/api/comment/delete-comment/${commentId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
          alert('Comment has been successfully deleted.');
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete comment.');
        }
      } catch (error) {
        alert('An error occurred while deleting the comment.');
        console.error('Delete error:', error);
      }
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentComments = comments.slice(startIndex, startIndex + postsPerPage);
  const totalPages = Math.ceil(comments.length / postsPerPage);

  // Handle no user info
  if (!userInfo) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">

      <h2 className="text-lg mb-12 text-center text-red-700">Danh sách bình luận</h2>

      {/* Display loading, error, or no comments */}
      {loading ? (
        <p className="text-center text-gray-500">Loading comments...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : comments.length === 0 ? (
        <p className="text-center text-gray-500">No comments found.</p>
      ) : (
        <>
          {/* Total comment count */}
          <div className="mb-12 text-center">
            <p className="text-lg font-semibold">Tổng bài viết: {comments.length}</p>
          </div>

          {/* Comment table */}
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date Updated</Table.HeadCell>
              <Table.HeadCell>Comment Content</Table.HeadCell>
              <Table.HeadCell>Number of Likes</Table.HeadCell>
              <Table.HeadCell>Post ID</Table.HeadCell>
              <Table.HeadCell>User ID</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {currentComments.map((comment) => (
                <Table.Row key={comment._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                  <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className="text-sky-500">{comment.content}</Table.Cell>
                  <Table.Cell className="text-blue-700 ">{comment.likes.length}</Table.Cell>
                  <Table.Cell className="text-gray-500">{comment.postId}</Table.Cell>
                  <Table.Cell className="text-gray-500">{comment.userId}</Table.Cell>
                  <Table.Cell>
                    <Button
                      className="bg-red-500 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Xóa
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {/* Pagination */}
          <div className="mt-4 flex justify-end">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </>
      )}
    </div>
  );
}
