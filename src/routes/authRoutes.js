import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import validate from "../validators/index.js";
import { registerSchema, loginSchema } from "../validators/user.rules.js";

const router = Router();

/**
 * @route   POST /api/auth/register
 *         register a new user and return token
 * @access  Public
 */
router.post("/register", validate(registerSchema), register);

/**
 * @route   POST /api/auth/login
 *        authenticate user & get token
 * @access  Public
 */
router.post('/login', validate(loginSchema), login);

export default router;