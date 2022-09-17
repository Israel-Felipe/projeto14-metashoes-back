import "./setup.js";
import express from "express";
import cors from "cors";

import userRouter from "./router/user.router.js";
import productsRouter from "./router/products.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(productsRouter);
app.use(userRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
