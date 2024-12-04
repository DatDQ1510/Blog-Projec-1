import { useContext } from 'react';
import { AuthContext } from '../AuthContext';

export default function Home() {
    const { loading, userInfo, isLoggedIn } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>; // Không hiển thị nội dung khi đang tải
    }

    if (!isLoggedIn || !userInfo) {
        return <h1>Please log in.</h1>; // Hiển thị thông báo nếu chưa đăng nhập
    }

    return (
        <>
            <h1>Welcome, {userInfo.username}!</h1>
            <h2>Your email: {userInfo.email}</h2>
            <h3>Your role: {userInfo.isAdmin ? 'Admin' : 'User'}</h3>
        </>
    );
}
