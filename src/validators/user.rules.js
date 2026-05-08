import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    email: Joi.string().email().required().lowercase(),
    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)'))
        .required()
        .messages({
            "string.pattern.base": "Password must contain at least one letter and one digit"
        })
});

export const loginSchema = Joi.object({
    email: Joi.string().email().required().lowercase(),
    password: Joi.string().required()
});