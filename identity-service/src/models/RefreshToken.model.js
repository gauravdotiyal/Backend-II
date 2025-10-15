const mongoose = require('mongoose');

const refreshTokenSchema= new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true,
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
    }
},{timestamps:true});

// it helps us to search for the inside query faster for data - optimization 
refreshTokenSchema.index({expiresAt:1},{expireAfterSeconds:0});

const RefreshToken= mongoose.model('RefreshToken', refreshTokenSchema);

module.exports=RefreshToken;