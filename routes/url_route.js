import express from "express";
import sendResponse from "../helpers/sendResponse";

const url_route = express();

url_route.use(express.json());

url_route.get("/", (req, res) => {
  sendResponse(
    res,
    200,
    false,
    "URL Route runnig",
    "Helper function is running"
  );
});

export default url_route;
