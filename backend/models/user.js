const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userDetails:{
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    
    }
})

let User = mongoose.model("User",userSchema);
module.exports = User;