import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import statsRoutes from "./stats.routes";
import serviceRoutes from "./service.routes";
import reservationRoutes from "./reservation.routes";
import transactionRoutes from "./transaction.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/stats", statsRoutes);
router.use("/services", serviceRoutes);
router.use("/reservations", reservationRoutes);
router.use("/transactions", transactionRoutes);

export default router;
