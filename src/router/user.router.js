import express from "express";

<<<<<<< HEAD
import { signUp, signIn } from "../controllers/user.controller.js";
=======
import { signUp } from "../controllers/user.controller.js";
>>>>>>> main

const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);

export default router;
