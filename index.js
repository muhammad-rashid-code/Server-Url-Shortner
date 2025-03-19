import express from "express";
import cors from "cors";
import "dotenv/config";
import morgan from "morgan";
import crypto from "crypto";
import mongoose from "mongoose";
import Url from "./models/Url.js";
import sendResponse from "./helpers/sendResponse.js";

const app = express();
const { PORT, MONGO_URI } = process.env;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("======Connected to MongoDB======="))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

const whiteList = [
  "https://client-url-shortner-two.vercel.app",
  "http://localhost:3000",
  "http://localhost:4000",
];

const corsOption = {
  origin: (origin, callback) => {
    if (!origin || whiteList.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(express.json());
app.use(cors(corsOption));
app.use(morgan("common"));

const generateShortUrl = (length = 6) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

// Create a new shortened URL
app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    if (!originalUrl) {
      return sendResponse(res, 400, "Original URL is required", null, null);
    }

    const urlRegex =
      /^(https?:\/\/)[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+(\:[0-9]{1,5})?(\/.*)?$/;
    if (!urlRegex.test(originalUrl)) {
      return sendResponse(res, 400, "Invalid URL format", null, null);
    }

    // Check if the URL is already in the database
    let existingUrl = await Url.findOne({ originalUrl });

    if (existingUrl) {
      return sendResponse(
        res,
        200,
        null,
        {
          shortUrl: `${req.protocol}://${req.get("host")}/${
            existingUrl.shortUrl
          }`,
          originalUrl,
        },
        "URL already shortened"
      );
    }

    const shortUrl = generateShortUrl();

    // Check if the short URL already exists, and handle conflicts
    let existingShortUrl = await Url.findOne({ shortUrl });
    if (existingShortUrl) {
      throw new Error("Short URL collision detected");
    }

    const newUrl = new Url({
      originalUrl,
      shortUrl,
    });

    await newUrl.save();

    return sendResponse(
      res,
      201,
      null,
      {
        shortUrl: `${req.protocol}://${req.get("host")}/${shortUrl}`,
        originalUrl,
      },
      "URL successfully shortened"
    );
  } catch (error) {
    console.error("Error while shortening URL:", error.message);
    return sendResponse(res, 500, error.message, null, "Internal Server Error");
  }
});

// Redirect to the original URL using the short URL
app.get("/:shortUrl", async (req, res) => {
  try {
    const { shortUrl } = req.params;

    const urlData = await Url.findOne({ shortUrl });

    if (!urlData) {
      return sendResponse(res, 404, "Short URL not found", null, null);
    }

    return res.redirect(urlData.originalUrl);
  } catch (error) {
    console.error("Error while redirecting:", error.message);
    return sendResponse(res, 500, error.message, null, "Internal Server Error");
  }
});

// Endpoint to get all stored URLs
app.get("/all-urls", async (req, res) => {
  try {
    const allUrls = await Url.find();

    if (allUrls.length === 0) {
      return sendResponse(res, 404, "No URLs found", null, null);
    }

    return sendResponse(
      res,
      200,
      null,
      allUrls,
      "All URLs fetched successfully"
    );
  } catch (error) {
    console.error("Error while fetching all URLs:", error.message);
    return sendResponse(res, 500, error.message, null, "Internal Server Error");
  }
});

// Start the server
app.listen(PORT, () => {
  try {
    console.log(`Server is running at PORT ${PORT}`);
  } catch (error) {
    console.error("Error while starting the server:", error.message);
  }
});
