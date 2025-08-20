import express from "express"
import { connectDB } from "./db/connectDB.js"
import dotenv from "dotenv"
dotenv.config()
import authRoutes from "./routes/auth.route.js"
import cookieParser from "cookie-parser"
import cors from 'cors'


const PORT=process.env.PORT || 5000
const app=express()

app.use(express.json())  // It converts the incoming json data to javascript object
app.use(cookieParser())
app.use(cors({
  origin:'http://localhost:5173',
  credentials:true}))

app.use("/api/auth",authRoutes)

app.listen(PORT,()=>{
  connectDB()
  console.log("Listening to port:",PORT)
})