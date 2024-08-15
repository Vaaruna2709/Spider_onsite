const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    startTime: {
        type: Date,
        default: Date.now, 
    },
    endTime: {
        type: Date,
    },
    description:String,
    status: {
        type: String,
        enum: ['Scheduled', 'Active', 'Ended'],
        default: 'Active'
    },
    maxBid:{
        type:Number,
        default:0
    }
});

let Product = mongoose.model("Product", productSchema);
module.exports = Product;
