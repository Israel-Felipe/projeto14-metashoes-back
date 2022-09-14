import express from "express";
import cors from "cors";

import userRouter from "./router/user.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);

app.listen(5000, () => console.log("Listen server on port 5000"));
