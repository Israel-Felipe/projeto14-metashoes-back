import express from "express";

const router = express.Router();

import {
  registerProduct,
  deleteProduct,
} from "../controllers/admin.controller.js";
import { adminMiddleware } from "../middlewares/adminMiddleware.js";

router.post("/admin", adminMiddleware, registerProduct);
router.delete("/admin", adminMiddleware, deleteProduct);

export default router;
