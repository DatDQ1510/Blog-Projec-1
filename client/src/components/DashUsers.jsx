import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Table, Button, Pagination } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaTimes } from 'react-icons/fa';

export default function DashUser() {
  const { userInfo } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const postsPerPage = 5;
  const navigate = useNavigate();

  // Fetch users from the server
  useEffect(() => {
    const fetchUsers = async () => {
      if (!userInfo || !userInfo.id) return;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch('/api/user/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        const data = await res.json();
        console.log(data);
        if (res.ok) {
          setUsers(data.users || []);
        } else {
          setError(data.message || 'Failed to fetch users.');
        }
      } catch (error) {
        setError('An error occurred while fetching users.');
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userInfo]);

  // Handle user deletion
  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const res = await fetch(`/api/user/delete-user/${userId}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (res.ok) {
          setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
          alert('User has been successfully deleted.');
        } else {
          const data = await res.json();
          alert(data.message || 'Failed to delete user.');
        }
      } catch (error) {
        alert('An error occurred while deleting the user.');
        console.error('Delete error:', error);
      }
    }
  };

  // Pagination logic
  const startIndex = (currentPage - 1) * postsPerPage;
  const currentUsers = users.slice(startIndex, startIndex + postsPerPage);
  const totalPages = Math.ceil(users.length / postsPerPage);

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
           <h2 className="text-lg mb-12 text-center text-red-700">Danh sách người dùng</h2>
      {/* Display loading, error, or no users */}
      {loading ? (
        <p className="text-center text-gray-500">Loading users...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : users.length === 0 ? (
        <p className="text-center text-gray-500">No users found.</p>
      ) : (
        <>
          {/* Total user count */}
          <div className="mb-12 text-center">
            <p className="text-lg font-semibold">Tổng người dùng: {users.length}</p>
          </div>

          {/* User table */}
          <Table hoverable={true} className="shadow-md">
            <Table.Head>
            <Table.HeadCell> Updated Date</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              
              <Table.HeadCell>Admin</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {currentUsers.map((user) => (
                <Table.Row key={user._id} className="bg-white">
                  <Table.Cell className="text-gray-600">
                    {new Date(user.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="text-pink-400">{user.username}</Table.Cell>
                  <Table.Cell className="text-blue-600">{user.email}</Table.Cell>
                  
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      className="bg-red-500 hover:bg-red-700 text-white"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
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
