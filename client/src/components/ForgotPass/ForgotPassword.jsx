import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./forgot.css";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const navigateTo = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/forgotpassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setMessage("An email has been sent to your email address with instructions to reset your password.");
            } else {
                const data = await response.json();
                setMessage(data.message);
            }
        } catch (error) {
            setMessage("Error submitting form");
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (e) => {
        setEmail(e.target.value);
    };

    return (
        <div className="app">
            
            <form onSubmit={handleSubmit} className="forgot-form">
            <h1 className="fh">Forgot Password</h1>
                <div>{message && <p>{message}</p>}</div>
                <input
                    className="forgotp"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={handleChange}
                    required
                />
                <button className="forgot-btn" type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ForgotPassword;
