const mongoose = require('mongoose');
const argon2=require('argon2');  


const userSchema= new mongoose.Schema({
   username:{
    type:String,
    unique:true,
    required:true,
    trim:true,
   },
   email:{
    type:String,
    unique:true,
    required:true,
    trim:true,
    lowercase:true,
   },
   password:{
    type:String,
    required:true,
   },
   createdAt:{
    type:Date,
    default:Date.now()
   }
}, {timestamps:true});


userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        try {
            this.password=await argon2.hash(this.password);
        } catch (error) {
            console.log(error);
        }
    }
})
// used when user login with their normal password it will compare with hashed one 
userSchema.methods.comparePassword= async function(candidatePassword){
    try {
        return await argon2.verify(this.password, candidatePassword);
    } catch (error) {
        throw error
        
    }
}
// provide the search functionality to use 
userSchema.index({username:'text'});

const User = mongoose.model('User', userSchema);

module.exports= User;
