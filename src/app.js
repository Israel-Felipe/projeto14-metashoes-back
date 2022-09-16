import "./setup.js";
import express from "express";
import cors from "cors";

import userRouter from "./router/user.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(userRouter);

app.get("/", (req, res) => {
  const testeHeroku = "vai heroku!";
  res.send(testeHeroku);
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port " + process.env.PORT);
});
