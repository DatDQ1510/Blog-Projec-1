import { useState } from 'react';
import { Alert, Button, Card, Label, TextInput } from 'flowbite-react';

export default function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        // Validate form
        if (newPassword !== confirmPassword) {
            setErrorMessage('New Password and Confirm Password do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/auth/change-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Send cookies with the request
                body: JSON.stringify({ oldPassword, newPassword, confirmPassword }),
            });

            if (response.ok) {
                setSuccessMessage('Password changed successfully.');
                setErrorMessage('');
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                const data = await response.json();
                setErrorMessage(data.message || 'Failed to change password.');
            }
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <Card className="max-w-md w-full">
                <h2 className="text-2xl font-semibold text-center mb-4">Change Password</h2>
                {errorMessage && (
                    <Alert color="failure" className="mb-4">
                        {errorMessage}
                    </Alert>
                )}
                {successMessage && (
                    <Alert color="success" className="mb-4">
                        {successMessage}
                    </Alert>
                )}
                <form onSubmit={handleChangePassword}>
                    <div className="mb-4">
                        <Label htmlFor="oldPassword" value="Old Password" />
                        <TextInput
                            id="oldPassword"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            required
                            placeholder="Enter your old password"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="newPassword" value="New Password" />
                        <TextInput
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            placeholder="Enter your new password"
                        />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="confirmPassword" value="Confirm New Password" />
                        <TextInput
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            placeholder="Confirm your new password"
                        />
                    </div>
                    <Button type="submit" gradientDuoTone="cyanToBlue" className="w-full">
                        Change Password
                    </Button>
                </form>
            </Card>
        </div>
    );
}
