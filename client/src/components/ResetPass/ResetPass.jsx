import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./reset.css"

const ResetPassword = () => {
    const { resetToken } = useParams();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/auth/resetpassword/${resetToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            if (response.ok) {
                setMessage("Password reset successfully.");
            } else {
                const data = await response.json();
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Error resetting password");
            console.error('Error resetting password:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "newPassword") {
            setNewPassword(value);
        } else if (name === "confirmPassword") {
            setConfirmPassword(value);
        }
    };

    return (
        <div className="app">
            <h1>Reset Password</h1>
            {message ? (
                <>
                    <p>{message}<Link to="/login">Login</Link></p>
                </>
            ) : (
                <form onSubmit={handleSubmit} className="forgot-form">
                    <div>{message && <p>{message}</p>}</div>
                    <input
                        className="forgotp"
                        type="password"
                        name="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={handleChange}
                        required
                    />
                    <input
                        className="forgotp"
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm new password"
                        value={confirmPassword}
                        onChange={handleChange}
                        required
                    />
                    <button className="forgot-btn" type="submit">Submit</button>
                </form>
            )}
        </div>
    );
};

export default ResetPassword;