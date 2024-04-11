const mysql = require("mysql2");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const sendPasswordResetEmail = require("../utils/sendPassword")

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Function to generate a secure random string
function generateSecretKey(length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
}

// Register a new user
exports.register = (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check if email is already registered
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        // If email is already registered, return error
        if (results.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // Generate a secret key for signing the JWT
        const secretKey = generateSecretKey(64); // Generate a 64-character secret key

        // Hash the password before saving it to the database
        bcrypt.hash(password, 10, (hashError, hash) => {
            if (hashError) {
                console.log(hashError);
                return res.status(500).json({ message: "Internal server error" });
            }

            // Save the new user to the database
            db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', [username, email, hash], (insertError, insertResults) => {
                if (insertError) {
                    console.log(insertError);
                    return res.status(500).json({ message: "Internal server error" });
                }

                // Generate a token after successful registration
                const token = jwt.sign({ userId: insertResults.insertId }, secretKey, { expiresIn: '1h' });

                // Send the token back to the client
                return res.status(201).json({ message: "User registered successfully", token });
            });
        });
    });
};

// Login user
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check if email exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        // If email is not found, return error
        if (results.length === 0) {
            return res.status(401).json({ message: "Incorrect email or password" });
        }

        const user = results[0];

        // Compare the provided password with the hashed password stored in the database
        bcrypt.compare(password, user.password, (compareError, isMatch) => {
            if (compareError) {
                console.log(compareError);
                return res.status(500).json({ message: "Internal server error" });
            }

            // If passwords do not match, return error
            if (!isMatch) {
                return res.status(401).json({ message: "Incorrect email or password" });
            }

            // Generate a secret key for signing the JWT
            const secretKey = generateSecretKey(64);

            // If passwords match, generate a token
            const token = jwt.sign({ userId: user.id }, secretKey, { expiresIn: '1h' });

            // Send the token back to the client
            return res.status(200).json({ message: "Login successful", token });
        });
    });
};

// Forgot password controller function
exports.forgotpassword = (req, res) => {
    const { email } = req.body;

    // Check if email exists in the database
    db.query('SELECT * FROM users WHERE email = ?', [email], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        // If email is not found, return error
        if (results.length === 0) {
            return res.status(404).json({ message: "No user with that email address" });
        }

        // Generate a unique token
        const token = crypto.randomBytes(20).toString('hex');

        // Store the token and associated email in the database
        db.query('INSERT INTO password_reset_tokens (email, token) VALUES (?, ?)', [email, token], (insertError, insertResults) => {
            if (insertError) {
                console.log(insertError);
                return res.status(500).json({ message: "Internal server error" });
            }

            // Send the reset password email with the token to the user's email address
           sendPasswordResetEmail(email, token); // Call the function here

            return res.status(200).json({ message: "Reset password email sent successfully" });
        });
    });
};

// Reset password controller function
exports.resetpassword = (req, res) => {
    const { resetToken } = req.params;
    const { email, newPassword } = req.body;

    // Retrieve the token and associated email from the database
    db.query('SELECT * FROM password_reset_tokens WHERE email = ? AND token = ?', [email, resetToken], (error, results) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: "Internal server error" });
        }

        // If no matching token found, return error
        if (results.length === 0) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Update the user's password in the database
        bcrypt.hash(newPassword, 10, (hashError, hash) => {
            if (hashError) {
                console.log(hashError);
                return res.status(500).json({ message: "Internal server error" });
            }

            db.query('UPDATE users SET password = ? WHERE email = ?', [hash, email], (updateError, updateResults) => {
                if (updateError) {
                    console.log(updateError);
                    return res.status(500).json({ message: "Internal server error" });
                }

                // Delete the token from the database after password reset
                db.query('DELETE FROM password_reset_tokens WHERE email = ?', [email], (deleteError, deleteResults) => {
                    if (deleteError) {
                        console.log(deleteError);
                        return res.status(500).json({ message: "Internal server error" });
                    }

                    return res.status(200).json({ message: "Password reset successfully" });
                });
            });
        });
    });
};



