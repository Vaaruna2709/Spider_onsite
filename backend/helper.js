const nodemailer = require('nodemailer');

// Function to send an email
async function sendEmail(recipient, subject, message) {
    try {
        
       
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465, // You can also use 587 with TLS
            secure: true, // true for 465, false for 587
            auth: {
                user: 'vr.050306@gmail.com',
                pass: 'yabi cgxx prrg tvaz',//app password
            },
        });
        

        // Email options
        let mailOptions = {
            from: 'vr.050306@gmail.com', // Sender address
            to: recipient, // List of recipients
            subject: subject,
            text: message, 
        };

        // Send the email
        let info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail };
