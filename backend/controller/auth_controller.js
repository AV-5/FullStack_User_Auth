import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import user_model from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
export const tokenBlacklist = new Set();
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const userexist = await user_model.findOne({ email });
        if (userexist) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }
        const token = crypto.randomBytes(32).toString("hex");
        const user = await user_model.create({
            name,
            email,
            password,
            verificationToken: token
        });
        const verifyUrl = `${process.env.BASE_URL}/auth/verify/${token}`;

await sendEmail({
  email: user.email,
  subject: "Verify your Email",
  message: `
  <div style="font-family: Arial, sans-serif; max-width:500px; margin:auto; padding:20px; border:1px solid #eee; border-radius:8px;">
    
    <h2 style="color:#333;">Verify Your Email</h2>

    <p style="color:#555;">
      Thanks for signing up! Please verify your email by clicking the button below:
    </p>

    <div style="text-align:center; margin:20px 0;">
      <a href="${verifyUrl}" 
         style="background:#4CAF50; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">
        Verify Email
      </a>
    </div>

    <p style="font-size:14px; color:#777;">
      If the button doesn't work, use this link:<br/>
      <a href="${verifyUrl}">${verifyUrl}</a>
    </p>

  </div>
  `
});

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error registering user",
            error: error.message
        })
    }
}
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await user_model.findOne({ verificationToken: token });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();

        res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Email Verified</title>
</head>
<body style="font-family:Arial; background:#f4f4f4; display:flex; justify-content:center; align-items:center; height:100vh;">

  <div style="background:white; padding:30px; border-radius:10px; text-align:center; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
    
    <h2 style="color:green;">Email Verified</h2>
    <p>Your email has been successfully verified.</p>

    <a href="http://localhost:3000/login"
       style="display:inline-block; margin-top:15px; padding:10px 20px; background:#4CAF50; color:white; text-decoration:none; border-radius:5px;">
       Go to Login
    </a>

  </div>

</body>
</html>
`);

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await user_model.findOne({ email });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        if (!user.isVerified) {
            return res.status(403).json({
                success: false,
                message: "Please verify your email first"
            });
        }
        const passwordmatch = await bcrypt.compare(password, user.password);
        if (!passwordmatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password"
            })
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );
        user.password = undefined;
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        })
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Error logging in",
            error: error.message
        })
    }

}
const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
         if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token provided"
            });
        }
            jwt.verify(token, process.env.JWT_SECRET);
            tokenBlacklist.add(token);
        
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    }
    
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error logging out",
            error: error.message
        })
    }
}
const currentUser = async (req, res) => {
    try {
         const user = await user_model.findById(req.user.id)
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            })
        }
        res.status(200).json({
            success: true,
            message: "Current user fetched successfully",
            user
        })
    }
    catch(error) {
        res.status(500).json({
            success: false,
            message: "Error fetching current user",
            error: error.message
        })
    }
}
export { register, login, logout, currentUser,verifyEmail};