import mongoose from "mongoose"

export const connectDB=async()=>{
  try{
    const conn =await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)  
  }catch(error){
    console.log("Error while Connecting to database:",error.message)
    process.exit(1)
  }
}

