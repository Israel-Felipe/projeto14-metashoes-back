import express from "express";

import { teste } from "../controllers/user.controller.js";
import {
  getProduct,
  addToCar,
  removeFromCar,
} from "../controllers/products.controller.js";

const router = express.Router();

router.get("/teste", teste);
router.get("/produto/:ID_PRODUTO", getProduct);
router.post("/produto", addToCar);
router.delete("/produto/:idProduct", removeFromCar);

export default router;
