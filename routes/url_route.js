import express from "express";
import sendResponse from "../helpers/sendResponse.js";
import URI_Model from "../models/Url.js";

const url_route = express();

// Middleware to parse JSON requests
url_route.use(express.json());

// POST route to create a shortened URL
url_route.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;

    // Validate original URL
    if (!originalUrl || !/^https?:\/\/.+$/.test(originalUrl)) {
      return sendResponse(res, 400, true, null, "Invalid URL");
    }

    // Generate the shortened URL with the prefix
    let shortenedUrl = `${Math.random().toString(36).substring(2, 8)}`;

    // Check if the shortened URL already exists
    const existingUrl = await URI_Model.findOne({ shortenedUrl });
    if (existingUrl) {
      return sendResponse(res, 400, true, null, "Shortened URL already exists");
    }

    // Save to the database
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
        shortenedUrl: `${req.protocol}://${req.get("host")}/url/${
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

// GET route to redirect from shortened URL to original URL
url_route.get("/:slug", async (req, res) => {
  const slug = req.params.slug; // Get the slug from URL

  try {
    // Find the original URL from the database
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

// GET route to fetch all shortened URLs for history purposes
url_route.get("/red/history", async (req, res) => {
  try {
    // Fetch all shortened URLs from the database
    const urlData = await URI_Model.find({});

    // Check if no URLs exist in the database
    if (urlData.length === 0) {
      return sendResponse(res, 404, true, null, "No shortened URLs found");
    }

    // Return the list of original URLs and their shortened versions
    sendResponse(
      res,
      200,
      false,
      {
        urls: urlData.map((item) => ({
          originalUrl: item.originalUrl,
          // Update the shortened URL path to avoid conflict with the redirect route
          shortenedUrl: `${req.protocol}://${req.get(
            "host"
          )}/url/redirect?slug=${item.shortenedUrl}`,
        })),
      },
      "Successfully fetched all shortened URLs"
    );
  } catch (error) {
    // Catch any errors that occur during the database operation
    console.error("Error fetching URLs:", error);
    sendResponse(res, 500, true, null, "Internal server error");
  }
});

export default url_route;
