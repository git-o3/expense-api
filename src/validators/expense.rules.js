import Joi from "joi";

export const createExpenseSchema = Joi.object({
    category: Joi.object({
        name: Joi.string()
            .valid(
              "Groceries",
              "Leisure",
              "Electronics",
              "Utilities",
              "Clothing",
              "Health",
            )
            .required()
    }).required(),
    amount: Joi.number().positive().precision(2).required(),
    note: Joi.string().max(50).allow("", null).trim(),
    date: Joi.date().iso().required()
})

export const updateExpenseSchema = Joi.object({
    category: Joi.object({
        name: Joi.string()
            .valid(
              "Groceries",
              "Leisure",
              "Electronics",
              "Utilities",
              "Clothing",
              "Health",
            )
            .required()
    }).required(),
    amount: Joi.number().positive().precision(2).required(),
    note: Joi.string().max(50).allow("", null).trim(),
    date: Joi.date().iso().required()
}).min(1);

export const expenseQuerySchema = Joi.object({
    filter: Joi.string()
        .valid("past_week", "past_month", "last_3_months", "custom")
        .default("past_month"),
    startDate: Joi.date().iso().when("filter", { is: "custom", then: Joi.required() }),
    endDate: Joi.date().iso().when("filter", { is: "custom", then: Joi.required() })
});