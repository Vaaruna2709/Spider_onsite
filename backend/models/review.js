const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
    },
   rating: {
        type: Number,
        required: true,
        min:1,
        max:5
    },
    buyer:{
        type:String,
        required:true
    },
    productId:String
   
});

let Review = mongoose.model("Review", reviewSchema);
module.exports = Review;