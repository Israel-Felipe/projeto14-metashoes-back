import express from "express";
import cors from "cors";

import userRouter from "./router/user.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);

app.listen(process.env.PORT, () => console.log(`Listen server on port ${process.env.PORT}`));