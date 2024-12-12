import React, { useContext } from 'react';
import { TextInput, Label, Button } from 'flowbite-react';
import { AuthContext } from '../AuthContext';
import { Link } from 'react-router-dom';

export default function Profile() {
    const { userInfo } = useContext(AuthContext);

    // Kiểm tra nếu userInfo chưa có hoặc không hợp lệ
    if (!userInfo) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
                        User Profile
                    </h2>
                    <p className="text-red-500 text-center">Unable to load user information. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    User Profile
                </h2>
                <div className="mb-4">
                    <Label htmlFor="name">UserName</Label>
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
                        placeholder="email"
                        type="email"
                        defaultValue={userInfo.email || 'No email available'}
                        className="mt-1"
                        readOnly
                    />
                </div>

                <Button type="submit" className="w-full mb-7" gradientDuoTone='purpleToBlue' >
                    <Link to='/change-password'> Change Password</Link>
                </Button>
                <Button type='submit' gradientDuoTone='purpleToPink' className="w-full" outline>
                    <Link to='/create-post' >Create Post</Link>
                </Button>
            </form>
        </div>
    );
}
