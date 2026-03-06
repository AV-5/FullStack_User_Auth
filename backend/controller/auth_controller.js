import user_model from "../models/user_model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
        const user = await user_model.create({
            name,
            email,
            password
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
export { register, login, logout, currentUser };