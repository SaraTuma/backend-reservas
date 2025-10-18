import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { ServiceController } from "../controllers/service.controller";

const router = Router();
router.get("/", authenticate,authorize("findAllService"), ServiceController.findAll);
router.post("/", authenticate, authorize("createService"), ServiceController.create);
router.put("/:id", authenticate, authorize("updateService"), ServiceController.update);
router.delete("/:id", authenticate, authorize("deleteService"), ServiceController.delete);


export default router;