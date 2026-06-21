import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    username:{type:String,required:true},
    name:{type:String,required:true},
    avatar:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    bio:{type:String,default:""},
    location:{type:String,default:""},
    website:{type:String,default:""},
    joinedDate:{type:Date,default:Date.now()}
})

const User=mongoose.model("User",userSchema)
export default User