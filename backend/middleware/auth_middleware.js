import jwt from 'jsonwebtoken';
import { tokenBlacklist } from '../controller/auth_controller.js';
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        if (tokenBlacklist.has(token)) {
            return res.status(401).json({ message: "Token invalidated, please login again" });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Error in auth middleware:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};
export default authMiddleware;

