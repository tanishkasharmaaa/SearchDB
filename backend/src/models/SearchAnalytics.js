const mongoose = require("mongoose");

const SearchAnalyticsSchema = new mongoose.Schema({
  query: String,
  normalizedQuery: String,
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  position: Number,
  type: {
    type: String, // "SEARCH" | "CLICK"
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  "SearchAnalytics",
  SearchAnalyticsSchema
);
