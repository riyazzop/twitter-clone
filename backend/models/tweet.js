import mongoose from "mongoose";

const tweetSchema=new mongoose.Schema({
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    content:{type:String,required:true},
    likes:{type:Number,default:0},
    retweets:{type:Number,default:0},
    comments:{type:Number,default:0},
    likedBy:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    retweetBy:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
    image:{type:String,required:false},
    timestamp:{type:Date,default:Date.now()}
})

const Tweet=mongoose.model("Tweet",tweetSchema)
export default Tweet