import express from "express";
import {
  registerProduct,
  deleteProduct,
} from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

const router = express.Router();

router.post("/admin", adminMiddleware, registerProduct);
router.delete("/admin", adminMiddleware, deleteProduct);

export default router;
