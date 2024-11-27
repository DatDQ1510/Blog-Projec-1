import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, TextInput, Label, Alert, Spinner } from 'flowbite-react';

export default function SignUp() {
    const [formData, setFormData] = React.useState({ username: '', email: '', password: '' });
    const [errorMessages, setErrorMessages] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value.trim() }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { username, email, password } = formData;
        if (!username || !email || !password) {
            return setErrorMessages('Please fill in all fields');
        }

        try {
            setLoading(true);
            setErrorMessages(null);

            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || `Error: ${res.status}`);
            }

            const data = await res.json();
            console.log('Response data:', data);

            setLoading(false);
            navigate('/sign-in');
        } catch (err) {
            setErrorMessages(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 max-w-4xl w-full">
                {/* Left */}
                <div className="text-center md:text-left flex flex-col justify-center">
                    <Link
                        to="/"
                        className="font-bold text-gray-800 text-4xl"
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
                            <Label value="Your username" htmlFor="username" />
                            <TextInput
                                onChange={handleChange}
                                type="text"
                                placeholder="Your username"
                                id="username"
                                className="w-full"
                            />
                        </div>
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
                        <Button
                            gradientDuoTone="purpleToPink"
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Spinner aria-label="Loading" size="sm" className="mr-2" />
                                    Signing Up...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                    <div className="text-center mt-4">
                        <span className="text-gray-600">Have an account? </span>
                        <Link
                            to="/sign-in"
                            className="font-semibold text-purple-500 hover:underline hover:text-purple-700"
                        >
                            Sign In
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
