import express from "express";

const router = express.Router();

import {
  getAllProducts,
  getProduct,
  addToCar,
  removeFromCar,
} from "../controllers/products.controller.js";

router.get("/produto", getAllProducts);
router.get("/produto/:ID_PRODUTO", getProduct);
router.post("/produto", addToCar);
router.delete("/produto/:idProduct", removeFromCar);

export default router;
