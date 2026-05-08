import mongoose from "mongoose";

const Schema = mongoose.Schema

const expenseSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        index: true
    },
    category: {
        name: {
          type: String,
          required: true,
          enum: [
            "Groceries",
            "Leisure",
            "Electronics",
            "Utilities",
            "Clothing",
            "Health",
            "Others",
         ]
        }
    },
    note: {
        type: String,
        required: false,
        maxLength: [50, "Note cannot exceed 50 characters"]
    },
    amount: {
        type: Number,
        required: true,
        min: [0, "Amount cannot be negative"]
    },
    date: {
        type: Date,
        required: true,
        index: true
    }


}, { timestamps: true });

expenseSchema.index({ userId: 1, date: -1 });

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense