import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(express.json());
app.use(morgan("common"));
app.use(cors("*"));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(` ========== db conn ========== `);
  })
  .catch((error) => {
    console.log(` ========== db fail ========== \n+${error}`);
  });

app.get("/", (req, res) => {
  res.json({ Greeting: "Welcome to server" });
});

app.listen(PORT, () => {
  console.log(`Server is runnig at ${PORT}`);
});
