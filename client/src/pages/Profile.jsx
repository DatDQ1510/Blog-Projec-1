import React, { useContext } from 'react';
import { TextInput, Label, Button } from 'flowbite-react';
import { AuthContext } from '../AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { ProfileComponents } from '../components/ProfileComponents';

export default function Profile() {
    const { userInfo } = useContext(AuthContext);
    const userId = userInfo?.id;
    const navigate = useNavigate();

    const handleDeleteUser = async () => {
        const confirmDelete = window.confirm('Are you sure you want to delete your account?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`/api/user/delete-user/${userId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                alert('User deleted successfully!');
                navigate('/sign-up'); // Chuyển hướng sau khi xóa
            } else {
                const errorData = await response.json();
                alert(`Error deleting user: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An unexpected error occurred.');
        }
    };

    // Kiểm tra nếu userInfo chưa có hoặc không hợp lệ
    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
                        User Profile
                    </h2>
                    <p className="text-red-500 text-center">
                        Unable to load user information. Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="hidden md:block bg-white shadow-lg">
                <ProfileComponents />
            </div>

            {/* Main Content */} 
            <div className="flex-1 flex items-center justify-center">
                <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
                        Hồ sơ người dùng
                    </h2>
                    <div className="mb-4">
                        <Label htmlFor="name">Tên tài khoản</Label>
                        <TextInput
                            id="name"
                            placeholder="Name"
                            type="text"
                            defaultValue={userInfo.username || 'No username available'}
                            className="mt-1"
                            readOnly
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="email">Email</Label>
                        <TextInput
                            id="email"
                            placeholder="Email"
                            type="email"
                            defaultValue={userInfo.email || 'No email available'}
                            className="mt-1"
                            readOnly
                        />
                    </div>

                    {/* Nút Change Password */}
                    <Link to="/change-password" className="block">
                        <Button className="w-full mb-4" gradientDuoTone="purpleToBlue">
                            Thay đổi mật khẩu
                        </Button>
                    </Link>

                    {/* Nút Create Post */}
                    <Link to="/create-my-post" className="block">
                        <Button gradientDuoTone="purpleToPink" className="w-full mb-4" outline>
                            Tạo bài viết
                        </Button>
                    </Link>

                    {/* Nút Delete User */}
                    {!userInfo.isAdmin && (
                        <Button
                            gradientDuoTone="redToYellow"
                            className="w-full mb-4"
                            outline
                            onClick={handleDeleteUser}
                        >
                            Xóa người dùng
                        </Button>
                    )}
                   
                </form>
            </div>
        </div>
    );
}
