const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Product = require('./models/product');
const User = require('./models/user');
const { sendEmail } = require('./helper');

const app = express();

// Middleware setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
const user = require('./routes/user');
const product = require("./routes/product");
const bid = require("./routes/bid");
const review = require('./routes/review');
app.use("/user", user);
app.use('/product', product);
app.use('/bid', bid);
app.use('/review', review);

app.get("/", (req, res) => {
    res.send("root is working");
});

async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/auctionDetails');
        console.log("Connection successful");

        // Initial notification on server start
        await checkAndNotify();
    } catch (err) {
        console.error('Connection error:', err);
    }
}
async function checkAndNotify() {
    const now = new Date();
    console.log('Running checkAndNotify...');
    
    try {
        const products = await Product.find();
        // console.log('Products found:', products);

        for (let product of products) {
            if (product.startTime <= now && product.endTime > now && product.status === 'Scheduled') {
                product.status = 'Active';
                await product.save();
                // console.log(`Product ${product.productName} status changed to Active`);
                await notifyUsers(product, 'Auction is now Active');
            } else if (product.endTime <= now && product.status === 'Active') {
                product.status = 'Ended';
                await product.save();
                // console.log(`Product ${product.productName} status changed to Ended`);
                await notifyUsers(product, 'Auction has Ended');
            }
        }
        console.log('Initial auction statuses checked and notifications sent');
    } catch (err) {
        console.error('Error during initial auction status check:', err);
    }
}

cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        console.log('Running cron job...');
        const products = await Product.find();
        console.log('Products found for cron job:', products);
    
        for (const product of products) {
            if (product.startTime <= now && product.endTime > now && product.status !== 'Active') {
                product.status = 'Active';
                await product.save();
                console.log(`Product ${product.productName} status changed to Active`);
                await notifyUsers(product, 'Auction is now Active');
            } else if (product.endTime <= now && product.status !== 'Ended') {
                product.status = 'Ended';
                await product.save();
                console.log(`Product ${product.productName} status changed to Ended`);
                await notifyUsers(product, 'Auction has Ended');
            }
        }
    
        console.log('Auction statuses updated and notifications sent');
    } catch (err) {
        console.error('Error updating auction statuses:', err);
    }
    
})

async function notifyUsers(product, message) {
    const usersToNotify = await User.find();
    console.log(`Notifying ${usersToNotify.length} users about ${product.productName}`);

    for (const user of usersToNotify) {
        try {
            console.log(`Attempting to send email to ${user.email}`);
            await sendEmail(user.email, `Update on ${product.productName}`, message);
            console.log(`Notification sent to ${user.email}`);
        } catch (error) {
            console.error(`Failed to send notification to ${user.email}:`, error);
        }
    }
}


app.listen(8080, () => console.log(`Server running on port 8080`));

// Start the main function to connect to the database and send initial notifications
main();
