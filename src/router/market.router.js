import express from "express";

const router = express.Router();

import {
  addToCar,
  removeFromCar,
  getItemsFromCar,
} from "../controllers/market.controller.js";

router.post("/market", addToCar);
router.delete("/market/:idProduct", removeFromCar);
router.get("/market", getItemsFromCar);

export default router;
