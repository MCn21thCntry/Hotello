const nodemailer = require('nodemailer');

const sendPasswordResetEmail = async (recipientEmail, resetToken) => {
    // Create a nodemailer transporter
    const transporter = nodemailer.createTransport({
        // Use any SMTP transport configuration here
        // Example configuration for Gmail:
        service: process.env.SERVICE,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD,
        },
    });

    // Email message
    const mailOptions = {
        from: process.env.USER,
        to: recipientEmail,
        subject: 'Reset Your Password',
        html: `
            <p>You have requested to reset your password. Click the link below to reset it:</p>
            <a href="http://localhost:5000/auth/resetpassword/${resetToken}">Reset Password</a>
        `,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log('Password reset email sent successfully');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
};

module.exports = sendPasswordResetEmail;
