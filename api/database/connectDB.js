import mongoose from "mongoose";

export const connectDB = async(req,res)=>{
  const db = await mongoose.connect(process.env.MONGO_URI)
  if(db){
    console.log("mongodb connected");
  }
  else{
    return console.log("Error connecting to MONGO database");
  }
}