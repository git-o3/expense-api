import { Router } from "express";
import { 
    createExpense,
    getExpenses,
    updateExpense,
    deleteExpense,
    getStats,
    exportExpenses
} from "../controllers/expenseController.js";
import validate from "../validators/index.js";
import { protect } from "../auth/auth.js";
import {
    createExpenseSchema,
    updateExpenseSchema,
    expenseQuerySchema
} from "../validators/expense.rules.js"


const router = Router();

router.use(protect)

router.route("/")
    .get(validate(expenseQuerySchema, "query"), getExpenses)
    .post(validate(createExpenseSchema, "body"), createExpense)

router.get("/stats", getStats)
router.get("/export", exportExpenses)
 
router.route("/:id")
    .put(validate(updateExpenseSchema), updateExpense)
    .delete(deleteExpense)

export default router;