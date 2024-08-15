const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
   buyer: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    product:{
        required:true,
        type:String
    }
   
});

let Bid = mongoose.model("Bid", bidSchema);
module.exports =Bid;