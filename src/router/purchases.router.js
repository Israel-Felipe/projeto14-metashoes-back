import express from "express";
import { createPurchase } from "../controllers/purchase.controller";
import { checkAuthorization } from "../middlewares/auth.middlewares";

const router = express.Router();

router.post("/pagamento", createPurchase);

export default router;
