import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function DashPost() {
    const { userInfo, loading } = useContext(AuthContext);

    // Kiểm tra nếu đang tải
    if (loading) {
        return <div>Loading...</div>;
    }

    // Nếu không có userInfo hoặc không phải là admin, điều hướng đến trang login
    if (!userInfo || !userInfo.isAdmin) {
        return <div>You are not authorized to view this page. Please log in as admin.</div>;
    }

    return (
        <div>
            <h1>DashPost</h1>
            <p>Welcome, {userInfo.username}. You are logged in as an admin.</p>
        </div>
    );
}
