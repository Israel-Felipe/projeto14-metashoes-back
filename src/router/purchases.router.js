import express from "express";
import { createPurchase } from "../controllers/purchase.controller";
import { checkAuthorization } from "../middlewares/auth.middlewares";

const router = express.Router();

router.post("/purchases", checkAuthorization, createPurchase);

export default router;