import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/user.js"
import Tweet from "./models/tweet.js"
dotenv.config()

const app=express()
app.use(cors())
app.use(express.json())
const port=process.env.PORT||5000
const url=process.env.MONGODB_URL

async function connectDB(){
    try {
        await mongoose.connect(url)
        console.log("Database connected successfully")
    } catch (error) {
        console.log(error)
    }
}

app.get('/',(req,res)=>{
    res.send("Welcome to twitter clone")
})

//Register
app.post('/register',async(req,res)=>{
    try {
        const existingUser=await User.findOne({email:req.body.email})
        if (existingUser) {
            return res.status(200).send(existingUser)
        }
        const newUser=await User.create(req.body)
        return res.status(201).send(newUser)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

//Login User
app.get('/loggedinuser',async(req,res)=>{
    try {
        const {email}=req.query
        
        if (!email) {
            return res.status(200).send({error:"Email required"})
        }
        const user=await User.findOne({email})
        if (!user) return res.status(404).send({error:"User not found"})
        return res.status(200).send(user)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

//Userupdate
app.patch('/userupdate/:email',async(req,res)=>{
    try {
        const {email}=req.params.query
        const updatedUser=await User.findOneAndUpdate({email},{$set:req,body},{new:true})
        
        return res.status(401).send(updatedUser)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

//Tweet API
//Post Tweet
app.post("/post-tweet",async (req,res) => {
    try {
        const tweet=await Tweet.create(req.body)
        return res.status(201).send({tweet})
    } catch (error) {
        return res.status(400).send({error:error.message})
    }
})

//get all tweet
app.get('/get-tweets',async(req,res)=>{
    try {
        const tweets=await Tweet.find().sort({timestamp:-1}).populate("author")
        return res.status(200).send(tweets)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

//like tweet
app.post("/like/:tweetid",async (req,res) => {
    try {
        const {userId}=req.body
        const tweet=await Tweet.findById(req.params.tweetid)
        if(!tweet.likedBy.includes(userId)){
            tweet.likes++
            tweet.likedBy.push(userId)
            await tweet.save()
            return res.status(200).send(tweet)
    
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

//retweet
app.post("/retweet/:tweetid",async (req,res) => {
    try {
        const {userId}=req.body
        const tweet=await Tweet.findById(req.params.tweetid)
        if(!tweet.retweetBy.includes(userId)){
            tweet.retweets++
            tweet.retweetBy.push(userId)
            await tweet.save()
            return res.status(200).send(tweet)
    
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})


app.listen(port,()=>{
    connectDB()
    console.log(`Server started on port ${port}`)
})