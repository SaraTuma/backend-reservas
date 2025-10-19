import { Router } from "express";
import { TransactionController } from "../controllers/transaction.controller";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";

const router = Router();

router.get("/", authenticate,authorize("findAllTransactions"), TransactionController.findAll);

export default router;
