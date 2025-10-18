import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { ReservationController } from "../controllers/reservation.controller";

const router = Router();
router.post("/", authenticate, authorize("createReservation"), ReservationController.create);
router.put("/:id/cancel", authenticate, authorize("cancelReservation"), ReservationController.cancel);
router.get("/", authenticate, ReservationController.findAll);
router.put("/:id/status", authenticate, authorize("updateReservationStatus"), ReservationController.updateStatus);

export default router;
