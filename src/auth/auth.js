import jwt from "jsonwebtoken";
import User from "../models/user.js";
import logger from "../utils/logger.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");
            return next();
        } catch (error) {
            logger.error(`Auth Error: ${error.message}`);
            return res.status(401).json({ message: "Unauthorized"})
        }
    }

    if (!token) {
        return res.status(401).json({ message: "Unauthorized"})
    }
};
