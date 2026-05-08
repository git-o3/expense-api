import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { asyncHandler } from "../middleware/asyncHandler.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "24h"});
};

export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    
    const userExists = await User.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({ name, email, password });
    res.status(201).json({ token: generateToken(user._id) });
});

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // explicitly select password cos it's hidden by default
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.comparePassword(password))) {
        res.json({ token: generateToken(user._id) });
    } else {
        res.status(401);
        throw new Error("Invalid email & password");
    }
});