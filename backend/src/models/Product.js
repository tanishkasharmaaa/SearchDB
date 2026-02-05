const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String },
  description: String,

  category: String,
  brand: String,
  model: String,

  price: { type: Number, index: true },
  mrp: Number,
  currency: { type: String, default: "INR" },

  rating: Number,
  ratingCount: Number,
  unitsSold: Number,
  returnRate: Number,

  stock: Number,

  metadata: {
    ram: Number,
    storage: Number,
    color: String,
    screenSize: Number,
    brightness: Number
  },

  createdAt: { type: Date, default: Date.now }
});

/**
 * 🔥 TEXT INDEX
 * Title > Description > Metadata
 */
ProductSchema.index(
  {
    title: "text",
    description: "text",
    "metadata.color": "text",
    model: "text"
  },
  {
    weights: {
      title: 10,
      model: 8,
      description: 5
    }
  }
);

module.exports = mongoose.model("Product", ProductSchema);
