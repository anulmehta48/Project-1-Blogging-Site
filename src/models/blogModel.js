const mongoose = require("mongoose");

// Define Blog Schema
const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    category: {
      type: String,
      required: true,
      default: [],
    },
    subcategory: {
      type: [String],
      default: [],
    },
    deletedAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Creating Blog model it will create Blog Collection in our Database
module.exports = mongoose.model("Blog", blogSchema);
