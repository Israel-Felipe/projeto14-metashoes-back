import express from "express";

import { signUp } from "../controllers/user.controller.js";
import {
  getProduct,
  addToCar,
  removeFromCar,
  getAllProducts,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/produto", getAllProducts);
router.get("/produto/:ID_PRODUTO", getProduct);
router.post("/produto", addToCar);
router.delete("/produto/:idProduct", removeFromCar);

router.post("/signUp", signUp);

export default router;
