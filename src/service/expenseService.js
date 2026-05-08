import Expense from "../models/expense.js";

/**
 * private helper: handles the brain of the date filtering
 * keeping this here maintains the "Server-as-Source" principle.
 */

const calculateDateQuery = (filter, customRange = {}) => {
    const now = new Date();
    let start = new Date();

    switch (filter) {
        case "past_week":
            start.setDate(now.getDate() - 7);
            return {$gte: start };

        case "past_month":
            start.setMonth(now.getMonth() - 1);
            return { $gte: start };

        case "last_3_months":
            start.setMonth(now.getMonth() - 3);
            return { $gte: start };

        case "custom":
            //custom range for both start and end from the user
            if (customRange.startDate && customRange.endDate) {
                return {
                    $gte: new Date(customRange.startDate),
                    $lte: new Date(customRange.endDate),
                };
            }
            return {};

        default:
            return {}; // returns all expenses if no filter is provided
    }
}

const ExpenseService = {
    /**
     * create: Hydrates the denormalized category and saves the record.
     */
    async createExpense(userId, expenseData) {
        // business logic goes here 
        // hex colors or icons if needed
        const newExpense = new Expense({
            userId,
            ...expenseData,
            // model handles the enum validation for category name
        })

        return await newExpense.save()
    },

    async getUserExpenses(userId, filter, customRange) {
        const dateQuery = calculateDateQuery(filter, customRange);

        const query = { userId };
        if (Object.keys(dateQuery).length > 0) {
            query.date = dateQuery;
        }

        // sort by date descending (newest first) for a dashboard view
        return await Expense.find(query).sort({ date: -1 });
    },


    /**
     * user can only update their own data
     */
    async updateExpense(expenseId, userId, updateData) {
        const expense = await Expense.findOneAndUpdate(
            { _id: expenseId, userId }, //must match both ID and Owner
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!expense) throw new Error("Expense not found or unauthorized");
        
        return expense;
    },

    async deleteExpense(expenseId, userId) {
        const result = await Expense.findOneAndDelete({ _id: expenseId, userId });
        if (!result) throw new Error("Expense not found or unauthorized")

        return { message: "Expense deleted successfully"};
    },
};

export default ExpenseService;