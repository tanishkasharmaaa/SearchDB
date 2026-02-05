const Product = require("../models/Product");
const normalizeQuery = require("../utils/normalizeQuery");
const parseIntent = require("../utils/intentParser");
const rankProducts = require("./rankProducts");
const { spellCorrectQuery } = require("../utils/spellCorrect");
const { extractAttributes } = require("../utils/extractAttributes");
const cleanTextQuery = require("../utils/cleanTextQuery");

exports.search = async (rawQuery) => {
  const normalized = normalizeQuery(rawQuery);
  const correctedQuery = spellCorrectQuery(normalized, global.DICTIONARY);
  const attributes = extractAttributes(correctedQuery);
  const textQuery = cleanTextQuery(correctedQuery);

  const mongoQuery = {};
  if (textQuery.length > 0) mongoQuery.$text = { $search: textQuery };
  if (attributes.color) mongoQuery["Metadata.color"] = attributes.color;
  if (attributes.storage) mongoQuery["Metadata.storage"] = attributes.storage;
  if (attributes.ram) mongoQuery["Metadata.ram"] = attributes.ram;
  if (attributes.price) mongoQuery.price = { $lte: attributes.price };

  let products = await Product.find(
    mongoQuery,
    textQuery.length > 0 ? { score: { $meta: "textScore" } } : {}
  ).limit(300);

  // 🔹 Rank with comparatives
  products = products
    .map(p => {
      let score = (p.rating || 0) * 2 + Math.log((p.unitsSold || 1));
      if (p.stock <= 0) score -= 5;
      return { ...p.toObject(), _score: score };
    });

  // Apply comparatives
  if (attributes.priceOrder) {
    products.sort((a, b) => attributes.priceOrder === "asc" ? a.price - b.price : b.price - a.price);
  } else if (attributes.storageOrder) {
    products.sort((a, b) => {
      const getStorageValue = s => parseInt(s?.replace(/[^0-9]/g, "") || 0);
      return attributes.storageOrder === "desc" ? getStorageValue(b.Metadata.storage) - getStorageValue(a.Metadata.storage)
                                               : getStorageValue(a.Metadata.storage) - getStorageValue(b.Metadata.storage);
    });
  } else if (attributes.ratingOrder) {
    products.sort((a, b) => b.rating - a.rating);
  } else {
    // Default: sort by score
    products.sort((a, b) => b._score - a._score);
  }

  return products;
};
