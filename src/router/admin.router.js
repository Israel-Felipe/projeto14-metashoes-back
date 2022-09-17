import express from "express";

const router = express.Router();

import {
  registerProduct,
  deleteProduct,
} from "../controllers/admin.controller.js";

router.post("/registerProduct", registerProduct);
router.delete("/deleteProduct", deleteProduct);

export default router;
