import express from "express";

const url_route = express();

url_route.use(express.json());

url_route.get("/", (req, res) => {
  res.json({ Status: "URL Route Running." });
});

export default url_route;
