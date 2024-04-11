
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import UserInfo from "./UserInfo";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [redirectAfterLogin, setRedirectAfterLogin] = useState(null);
    const location = useLocation();

    useEffect(() => {
        // Check user's login status from your authentication mechanism
        // For example, you can check if there's a token in localStorage
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token); // Set isLoggedIn based on token existence

        // If user is logged in and there's a redirectAfterLogin path, redirect
        if (isLoggedIn && redirectAfterLogin) {
            window.location.href = redirectAfterLogin; // Redirect to the specified path
            setRedirectAfterLogin(null); // Reset redirectAfterLogin state
        }
    }, [isLoggedIn, redirectAfterLogin]);

    const handleLogout = () => {
        // Perform logout actions (e.g., clear localStorage, reset state, etc.)
        localStorage.removeItem('token'); // Clear token from localStorage
        setIsLoggedIn(false); // Set isLoggedIn to false
    };

    const handleLogin = () => {
        // Save the current location before redirecting to login
        setRedirectAfterLogin(location.pathname);
    }
    return (
        <>
            <header className="header container">
                <div className="left">
                    <h1>Hotello</h1>
                </div>

                <div className="right">
                    <ul>
                        {isLoggedIn ? (
                            <>
                                <li><Link to="/">Home</Link></li>
                                <li><button className="sbtn lg" onClick={handleLogout}>Logout</button></li>
                            </>
                        ) : (
                            <>
                                <li><Link to='/login'>Login</Link></li>
                                <li><Link to="/register">Register</Link></li>
                            </>
                        )}
                    </ul>
                </div>
            </header>
            {isLoggedIn && <UserInfo />}
        </>
    );
};

export default Header;
