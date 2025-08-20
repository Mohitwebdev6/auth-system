import express from "express";
import { forgotPassword, getUser, login, logout, resetPassword, sendVerificationCode, signup, verifyEmail } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();




router.post("/signup",signup)

router.post("/login",login)

router.post("/logout",logout)

router.post("/verify-email",verifyEmail)

router.post("/sendverificationcode",sendVerificationCode)

router.post("/forgot-password",forgotPassword)

router.post("/resetpassword/:token",resetPassword)

router.get("/getuser",authMiddleware,getUser)


export default router