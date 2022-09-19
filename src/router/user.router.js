import express from "express";

import { signUp, signIn, logout } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);

router.use(authMiddleware);
router.delete("/signIn", logout);

export default router;
