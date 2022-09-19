import "./setup.js";
import express from "express";
import cors from "cors";

import userRouter from "./router/user.router.js";
import productsRouter from "./router/products.router.js";
import adminRouter from "./router/admin.router.js";
import marketRouter from "./router/market.router.js";
import purchaseRouter from "./router/purchases.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(marketRouter);
app.use(productsRouter);
app.use(userRouter);
app.use(adminRouter);
app.use(purchaseRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
