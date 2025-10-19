import { Router } from "express";
import { authenticate } from "../middlewares/authenticate";
import { authorize } from "../middlewares/authorize";
import { UserController } from "../controllers/user.controller";

const router = Router();
router.get("/", authenticate,authorize("findAllUser"), UserController.findAll);
//router.put("/:id", authenticate, authorize("updateUser"), UserController.update);
router.delete("/:id", authenticate, authorize("deleteUser"), UserController.delete);
router.get("/:id", authenticate, authorize("lientsByProviderUser"), UserController.getClientsByProvider);


export default router;