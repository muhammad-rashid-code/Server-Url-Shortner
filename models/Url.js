import mongoose, { Schema } from "mongoose";

const UrlSchema = new Schema(
  {
    originalUrl: { type: String, required: true },
    shortenedUrl: { type: String, required: true, unique: true },
    customSlug: { type: String, unique: true, sparse: true }, // optional custom slug
    expiresAt: { type: Date, default: null }, // optional expiration date
    clicks: { type: Number, default: 0 }, // analytics: how many times the URL has been clicked
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    }, // reference to a user if applicablegit git
  },
  { timestamps: true }
);

const URI_Model = mongoose.model("Url", UrlSchema);

export default URI_Model;
