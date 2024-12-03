import { useEffect, useState } from 'react';

export default function Home() {
    const [user, setUser] = useState(null); // Trạng thái người dùng
    const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                // Gửi yêu cầu kiểm tra trạng thái đăng nhập
                const response = await fetch('http://localhost:3000/api/auth/check-auth', {
                    method: 'GET',
                    credentials: 'include', // Gửi cookie trong yêu cầu
                });

                if (response.ok) {
                    const data = await response.json(); // Lấy dữ liệu từ server
                    setUser(data); // Lưu thông tin người dùng
                } else {
                    // Nếu xác thực thất bại
                    const error = await response.json();
                    console.log('Authentication failed:', error.message);
                    setUser(null); // Không có người dùng
                }
            } catch (error) {
                console.error('Error checking login status:', error); // Lỗi bất ngờ
                setUser(null);
            } finally {
                setLoading(false); // Hoàn tất tải
            }
        };

        checkLoginStatus(); // Gọi hàm kiểm tra
    }, []); // Chỉ chạy khi component được mount

    return (
        <div>
            {loading ? (
                <h1>Loading...</h1> // Hiển thị khi đang kiểm tra
            ) : user ? (
                <h1>Welcome, {user.email}!</h1> // Hiển thị khi đăng nhập thành công
            ) : (
                <h1>Please log in.</h1> // Hiển thị khi chưa đăng nhập
            )}
        </div>
    );
}
