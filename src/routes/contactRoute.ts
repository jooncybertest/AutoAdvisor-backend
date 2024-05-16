import express from "express";
import ContactController from "../controllers/ContactController";
import { jwtCheck, jwtParse } from "../middleware/auth";

const router = express.Router();

router.get("/", jwtCheck, jwtParse, ContactController.getContact);
router.post("/", jwtCheck, jwtParse, ContactController.createContact);


export default router;