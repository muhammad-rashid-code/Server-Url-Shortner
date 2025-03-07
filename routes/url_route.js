import express from "express";
import sendResponse from "../helpers/sendResponse.js";
import URI_Model from "../models/Url.js";

const url_route = express();

url_route.use(express.json());

url_route.get("/", (req, res) => {
  sendResponse(
    res,
    200,
    false,
    "URL Route runnig 101",
    "Helper function is running"
  );
});
url_route.post("/shorten", async (req, res) => {
  try {
    const { originalUrl, customSlug } = req.body;

    // Check if the original URL is valid
    if (!originalUrl || !/^https?:\/\/.+$/.test(originalUrl)) {
      return sendResponse(res, 400, true, null, "Invalid URL");
    }

    // Generate a unique short URL (you can implement your own short URL generator)
    let shortenedUrl = customSlug || Math.random().toString(36).substring(2, 8); // simple random string generator

    // Check if the shortened URL already exists
    const existingUrl = await URI_Model.findOne({ shortenedUrl });
    if (existingUrl) {
      return sendResponse(res, 400, true, null, "Shortened URL already exists");
    }

    // Create the new shortened URL record
    const newUrl = new URI_Model({
      originalUrl,
      shortenedUrl,
      customSlug,
    });

    await newUrl.save();

    sendResponse(
      res,
      201,
      false,
      {
        originalUrl: newUrl.originalUrl,
        shortenedUrl: `${req.protocol}://${req.get("host")}/${
          newUrl.shortenedUrl
        }`,
      },
      "Shortened URL created successfully"
    );
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, true, null, "Internal server error");
  }
});
export default url_route;
