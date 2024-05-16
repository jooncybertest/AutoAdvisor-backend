import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import { validateMyUserRequest } from "../middleware/validation";
import MyVehicleController from "../controllers/MyVehicleController";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, MyVehicleController.getCurrentVehicle);

router.post("/", jwtCheck, jwtParse, MyVehicleController.createCurrentVehicle);

router.delete("/", jwtCheck, jwtParse, MyVehicleController.deleteVehicle);

export default router;
