import mongoose, { Schema } from "mongoose";
const Uri_Schema = new Schema(
  {
    Url: { type: String, required: true },
  },
  { timestamps: true }
);

const URI_Model = mongoose.model("Url", Uri_Schema);

export default URI_Model;
