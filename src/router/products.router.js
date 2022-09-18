import express from "express";

const router = express.Router();

import {
  getAllProducts,
  getProduct,
} from "../controllers/products.controller.js";

router.get("/produto", getAllProducts);
router.get("/produto/:ID_PRODUTO", getProduct);

export default router;
