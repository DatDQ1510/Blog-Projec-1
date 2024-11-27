import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextInput, Label, Alert, Spinner } from 'flowbite-react';
import { set } from 'mongoose';

export default function SignUp() {
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
        console.log('Form data:', formData); // Log formData để kiểm tra dữ liệu
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

            console.log('Request sent:', res); // Log kết quả response
            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }

            const data = await res.json();
            if (data.success === false) {
                return setErrorMessages(data.message);
            }
            setLoading(false);
            if (res.ok) {
                navigate('/');
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
                    <Link
                        to="/"
                        className="font-bold dark:text-white text-4xl"
                    >
                        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 
                        via-purple-500 to-pink-500 rounded-lg text-white">
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
                            <TextInput onChange={handleChange}
                                type="email"
                                placeholder="Your email"
                                id="email"
                                className="w-full"
                            />
                        </div>
                        <div>
                            <Label value="Your Password" htmlFor="password" />
                            <TextInput onChange={handleChange}
                                type="password"
                                placeholder="Your password"
                                id="password"
                                className="w-full"
                            />
                        </div>
                        <Button gradientDuoTone="purpleToPink" type="submit" className="w-full" disabled={loading}>
                            Sign In
                        </Button>
                    </form>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Haven't an account? </span>
                        <Link
                            to="/sign-up"
                            className="font-semibold text-purple-500 hover:underline hover:text-purple-700"
                        >
                            {
                                loading ? (
                                    <>
                                        <Spinner aria-label="Loading" size='sm ' />
                                        <span> Loading ... </span>
                                    </>
                                ) : 'Sign Up'
                            }
                        </Link>
                    </div>
                    {
                        errorMessages && (
                            <Alert className='mt-5 ' color='failure'>z
                                {errorMessages}
                            </Alert>
                        )
                    }
                </div>
            </div>
        </div>
    );
}

