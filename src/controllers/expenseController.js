import ExpenseService from "../service/expenseService.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/**
 * create a new expense
 * @route POST /api/v1/expenses
 */

export const createExpense = asyncHandler(async (req, res) => {
    // pull userId from the (protect) middleware
    const expense = await ExpenseService.createExpense(req.user.id, req.body);

    res.status(201).json({
        success: true,
        data: expense
    });
});

/**
 * get all user expenses with filters
 * @route GET /api/v1/expenses?filter=past_week
 */
export const getExpenses = asyncHandler(async (req, res) => {
    const { filter, startDate, endDate } = req.query;

    // hand off the filtering logic to the service
    const expenses = await ExpenseService.getUserExpenses(
        req.user.id,
        filter,
        { startDate, endDate }
    );

    res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
    });
});

/**
 *  update an expense
 * @route PUT /api/v1/expenses/:id
 */
export const updateExpense = asyncHandler(async (req, res) => {
    const expense = await ExpenseService.updateExpense(
        req.params.id,
        req.user.id,
        req.body
    );

    res.status(200).json({
        success: true,
        data: expense
    });
});

/**
 * delete an expense
 * @route DELETE /api/v1/expenses/:id
 */
export const deleteExpense = asyncHandler(async (req, res) => {
    const result = await ExpenseService.deleteExpense(req.params.id, req.user.id);

    res.status(200).json({
        success: true,
        data: result
    });
});