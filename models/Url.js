import mongoose from "mongoose";

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      unique: true, // Ensure that each original URL is unique
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true, // Ensure that each shortened URL is unique
    },
  },
  { timestamps: true }
);

const Url = mongoose.model("Url", urlSchema);

export default Url;
