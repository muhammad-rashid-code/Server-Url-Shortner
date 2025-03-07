import express from "express";
import sendResponse from "../helpers/sendResponse.js";
import URI_Model from "../models/Url.js";

const url_route = express();

// Middleware to parse JSON requests
url_route.use(express.json());

// Test route to check if the server is working
url_route.get("/", (req, res) => {
  sendResponse(
    res,
    200,
    false,
    "URL Route running 101",
    "Helper function is running"
  );
});

// POST route to create a shortened URL
url_route.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Check if the original URL is valid
    if (!originalUrl || !/^https?:\/\/.+$/.test(originalUrl)) {
      return sendResponse(res, 400, true, null, "Invalid URL");
    }

    // Generate a unique short URL with the prefix ~myslug~
    let shortenedUrl = `myslug~${Math.random().toString(36).substring(2, 8)}`;

    // Check if the shortened URL already exists
    const existingUrl = await URI_Model.findOne({ shortenedUrl });
    if (existingUrl) {
      return sendResponse(res, 400, true, null, "Shortened URL already exists");
    }

    // Create the new shortened URL record
    const newUrl = new URI_Model({
      originalUrl,
      shortenedUrl,
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

// GET route for accessing the shortened URL and redirecting to the original URL
url_route.get("/:slug", async (req, res) => {
  const slug = req.params.slug;

  try {
    // Find the record in the database using the shortened slug
    const urlData = await URI_Model.findOne({ shortenedUrl: slug });

    if (!urlData) {
      return sendResponse(res, 404, true, null, "Shortened URL not found");
    }

    // Redirect to the original URL
    return res.redirect(urlData.originalUrl);
  } catch (error) {
    console.error(error);
    sendResponse(res, 500, true, null, "Internal server error");
  }
});

export default url_route;
