import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextInput, Label, Alert, Spinner } from 'flowbite-react';
import { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { set } from 'mongoose';

export default function SignUp() {
    const { setIsLoggedIn, setUserInfo } = useContext(AuthContext);
    const [formData, setFormData] = React.useState({});
    const [errorMessages, setErrorMessages] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
 
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.email || !formData.password) {
            return setErrorMessages('Please fill in all fields');
        }


        try {
            setLoading(true);
            setErrorMessages(null);

            const res = await fetch('/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });


            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            if (data.success === false) {
                setErrorMessages(data.message);
                setLoading(false);
                return;
            }

            setLoading(false);
            if (res.ok) {
                // Lưu token và thông tin người dùng vào localStorage
                localStorage.setItem('access_token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                setUserInfo(data.user); // Lưu thông tin người dùng vào context (nếu có)
                console.log(data.user)
                setIsLoggedIn(true); // Cập nhật trạng thái đăng nhập
                navigate('/'); // Chuyển hướng về trang chính
            }
        } catch (err) {
            setErrorMessages(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen mt-10 flex items-center justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-4xl w-full">
                {/* Left */}
                <div className="text-center md:text-left flex flex-col justify-center">
                    <Link to="/" className="font-bold dark:text-white text-4xl">
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
                            Dat's
                        </span>
                        Blog
                    </Link>
                </div>

                {/* Right */}
                <div className="bg-white shadow-lg rounded-lg p-6">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <Label value="Your Email" htmlFor="email" />
                            <TextInput
                                onChange={handleChange}
                                type="email"
                                placeholder="Your email"
                                id="email"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label value="Your Password" htmlFor="password" />
                            <TextInput
                                onChange={handleChange}
                                type="password"
                                placeholder="Your password"
                                id="password"
                                className="w-full"
                            />
                        </div>
                        <Button gradientDuoTone="purpleToPink" type="submit" className="w-full" disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner aria-label="Loading" />
                                    <span> Loading ... </span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </form>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Haven't an account? </span>
                        <Link
                            to="/sign-up"
                            className="font-semibold text-purple-500 hover:underline hover:text-purple-700"
                        >
                            Sign Up
                        </Link>
                    </div>
                    {errorMessages && (
                        <Alert className="mt-5" color="failure">
                            {errorMessages}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
}
