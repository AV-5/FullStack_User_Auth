import express from "express";
import {register,login,logout,currentUser} from "../controller/auth_controller.js";
import authMiddleware from "../middleware/auth_middleware.js";
const router = express.Router();
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.get("/currentUser", authMiddleware, currentUser);
export default router;