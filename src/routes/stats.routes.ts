import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { StatsController } from "../controllers/stats.controller";

const router = Router();

router.get("/", authenticate, authorize("viewStats"), StatsController.getCounts);

export default router;
