import express from "express";
import { jwtCheck, jwtParse } from "../middleware/auth";
import StripeController from "../controllers/StripeController";

const router = express.Router();


router.post("/", StripeController.stripeCheckout);



export default router;