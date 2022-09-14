import express from "express";

import { teste } from "../controllers/user.controller.js";

const router = express.Router();

router.get("/teste", teste);

export default router;
