import express from "express";
import "dotenv/config";
import cors from "cors";
import morgan from "morgan";
import mongoose from "mongoose";
import url_route from "./routes/url_route.js";

const app = express();
const { MONGO_URI, PORT } = process.env;

app.use(express.json());
app.use(morgan("common"));
app.options("*", cors()); // Handle preflight requests for all routes
app.use("/url", url_route);

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
