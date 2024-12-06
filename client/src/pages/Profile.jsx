import React from 'react';
import { TextInput, Label, Button } from 'flowbite-react';
import { AuthContext } from '../AuthContext';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
export default function Profile() {
    const { userInfo } = useContext(AuthContext);

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
                        defaultValue={userInfo.username}
                        className="mt-1"
                    />
                </div>
                <div className="mb-4">
                    <Label htmlFor="email">Email</Label>
                    <TextInput
                        id="email"
                        placeholder="email"
                        type="email"
                        defaultValue={userInfo.email}
                        className="mt-1"
                    />
                </div>
                <div className="mb-6">
                    <Label htmlFor="password">Password</Label>
                    <TextInput
                        id="password"
                        placeholder="password"
                        type="password"
                        className="mt-1"
                    />
                </div>
                <Button type="submit" className="w-full mb-7" gradientDuoTone='purpleToBlue' >
                    Save Changes
                </Button>
                <Button type='submit' gradientDuoTone='purpleToPink' className="w-full" outline>
                    <Link to='/createpost' >Create Post</Link>
                </Button>
            </form>
        </div>
    );
}
