import Expense from "../models/expense.js";
import mongoose from "mongoose";

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
    };
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

        return await newExpense.save();
    },

    async getUserExpenses(userId, queryOptions) {
        const {
            filter,
            startDate,
            endDate,
            search,
            page = 1,
            limit = 10
        } = queryOptions;

        // build date query using customRange (startDate/endDate)
        const dateQuery = calculateDateQuery(filter, { startDate, endDate});

        const query = { userId };

        // apply date filter if exists
        if (Object.keys(dateQuery).length > 0) {
            query.date = dateQuery;
        }

        // search functionality (Regex for "note")
        if (search) {
            query.note = { $regex: search, $options: "i" };
        }

        // execution qeury with pagination 
        const skip = (page - 1) * limit;

        const expenses = await Expense.find(query)
            .sort({ date: -1 }) // newest first
            .skip(skip)
            .limit(Number(limit));

        // get total count for frontend pagination metadata
        const total = await Expense.countDocuments(query);

        return {
            expenses,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / limit)
            }
        };

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

    async getExpenseStats(userId) {
        const stats = await Expense.aggregate([
            // filter by user to leverage the index
            {
                $match: { userId: new mongoose.Types.ObjectId(userId) }
            },
            
            // group by category name and sum the amounts
            {
                $group: {
                    _id: "$category.name",
                    totalAmount: { $sum: "$amount"},
                    count: { $sum: 1 }, // number of transactions in the category
                    avgSpending: { $avg: "$amount" }
                }
            },

            // sort by highest spending first
            {
                $sort: { totalAmount: -1 }
            }
        ])

        return stats;
    },

    // export logic: fetch all data without pagination
    async getRawExpensesForExport(userId) {
        return await Expense.find({ userId }).sort({ date: -1}).lean();
    }
  
};

export default ExpenseService;
