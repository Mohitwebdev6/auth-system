import { User } from "../models/user.model.js";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateTokenAndSetCookie.js";
import { sendEmail } from "../nodemailer/email.js";

export const signup = async (req, res) => {
  const { email, password, name, username } = req.body;
  try {
    if (!email || !password || !name || !username) {
      res
        .status(400)
        .json({ success: false, message: "Please provide all the details" });
      throw new Error("All fields are required");
    }
    let doesUserExist = await User.findOne({ email });
    if (doesUserExist) {
      return res
        .status(401)
        .json({ success: false, message: "Email Id already registered" });
    }
    doesUserExist = await User.findOne({ username });
    if (doesUserExist) {
      return res
        .status(400)
        .json({ success: false, message: "username already taken" });
    }

    const user = new User({
      email,
      password,
      name,
      username,
    });

    await user.save();

    generateTokenAndSetCookie(res, user._id);

    res.status(201).json({
      ...user._doc,
      password: undefined,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { code, email } = req.body;

    if (!code || !email) {
      return res
        .status(400)
        .json({ success: false, message: "please provide code and email" });
    }
    const user = await User.findOne({ email });

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }
    if (user.verificationTokenExpiresAt > Date.now) {
      return res
        .status(400)
        .json({ success: false, message: "expired verification code" });
    }

    const verified = await user.matchEmail(code);
    if (verified) {
      user.isVerified = verified;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      return res.status(200).json({ message: "User verified successfully" });
    } else {
      return res.status(400).json({ message: "Wrong verification code" });
    }
  } catch (error) {
    console.log("Error in verification Controller:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server Error" });
  }
};

export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "please provide email" });
    }
    const user = await User.findOne({ email });

    if (user.isVerified) {
      return res
        .status(400)
        .json({ success: false, message: "User already verified" });
    }

    const verificationToken = Math.floor(
      100000 + Math.random() * 9000000
    ).toString();
  
    const hashverificationToken =await bcrypt.hash(verificationToken, 10);
    user.verificationToken = hashverificationToken;
    user.verificationTokenExpiresAt = Date.now() + 60 * 60 * 1000;

    await user.save();
      await sendEmail(
      email,
      "verify your email",
      `<div><h1>Email Verification code:</h1><p>${verificationToken}</p></div>`
    );
    res.status(200).json({ message: "Verification token send successfully" });
  } catch (error) {
    console.log("Error in sendVerificationCode controller:", error.message);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide email And password" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User doesnot Exist" });
    }
    const matchPassword = await user.matchPassword(password);
    if (!matchPassword) {
      return res
        .status(400)
        .json({ success: false, message: "Password doesnot match" });
    }
    user.lastLogin = Date.now();
    await user.save();
    generateTokenAndSetCookie(res, user._id);
    res.status(200).json({
      ...user._doc,
      passowrd: undefined,
      verificationToken: undefined,
      verificationTokenExpiresAt: undefined,
    });
  } catch (error) {
    console.log("Error in login controller:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res
      .status(200)
      .json({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.log("Some error occured in login controller:", error.message);
    return res
      .status(500)
      .message({ success: false, message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 10 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save();

   await sendEmail(user.email,"Reset Passowrd",`<div><h1>Click the link to reset your password</h1><a href="${process.env.CLIENT_URL}/resetpassword/${resetToken}">reset password</a></div>`)

    res.status(200).json({
      success: true,
      message: "Password reset link send to your email",
    });
  } catch (error) {
    console.log("Error in password reset controller:", error.message);
    res.status(500).send({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;
    if (!password) {
      return res
        .status(400)
        .json({ success: false, message: "please enter the passowrd" });
    }
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordExpiresAt = undefined;
    user.resetPasswordToken = undefined;
    user.save();
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in reset-password controller:", error.message);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  const { _id } = req;
  try {
    const user = await User.findOne({ _id }).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    res.status(200).json({
      success: true,
      user: {
        ...user._doc,
        verificationToken: undefined,
        verificationTokenExpiresAt: undefined,
      },
    });
  } catch (error) {}
};
