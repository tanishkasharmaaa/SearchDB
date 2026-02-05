const Product = require("../models/Product");
const { spellCorrectQuery } = require("../utils/spellCorrect");
const { extractAttributes } = require("../utils/extractAttributes");
const normalizeQuery = require("../utils/normalizeQuery");
const cleanTextQuery = require("../utils/cleanTextQuery");

exports.search = async (rawQuery) => {
  // 1️⃣ Normalize and spell-correct query
  const normalized = normalizeQuery(rawQuery);
  const correctedQuery = spellCorrectQuery(normalized, global.DICTIONARY);

  // 2️⃣ Extract attributes (brand, color, storage, RAM, price, comparatives)
  const attributes = extractAttributes(correctedQuery);
  console.log(attributes)

  // 3️⃣ Prepare text query for MongoDB $text search
  const textQuery = cleanTextQuery(correctedQuery);

  // 4️⃣ Build MongoDB query (case-insensitive using regex for safety)
  const mongoQuery = {};

  // 🔹 Text search (only if exists)
  if (textQuery.length > 0) {
    mongoQuery.$text = { $search: textQuery };
  }

  // 🔹 Brand / Model
  if (attributes.brand) {
  mongoQuery.$or = [
    { brand: { $regex: new RegExp(attributes.brand, "i") } },
    { title: { $regex: new RegExp(attributes.brand, "i") } }
  ];
}


  // 🔹 Color
  if (attributes.color) {
    mongoQuery["metadata.color"] = { $regex: new RegExp(attributes.color, "i") };
  }

  // 🔹 Storage
  if (attributes.storage) {
  const storageValue = parseInt(attributes.storage.replace(/[^0-9]/g, ""));
  if (!isNaN(storageValue)) {
    mongoQuery["metadata.storage"] = storageValue; // ✅ numeric
  }
}

  // 🔹 RAM
 
if (attributes.ram) {
  const ramValue = parseInt(attributes.ram.replace(/[^0-9]/g, ""));
  if (!isNaN(ramValue)) {
    mongoQuery["metadata.ram"] = ramValue; // ✅ numeric
  }
}

  // 🔹 Price
  if (attributes.price) {
    mongoQuery.price = { $lte: attributes.price };
  }

  // 5️⃣ Fetch products from MongoDB
  let products = await Product.find(
    mongoQuery,
    textQuery.length > 0 ? { score: { $meta: "textScore" } } : {}
  ).limit(300);
  console.log(products)

  // 🔹 Fallback: regex on title if $text search + filters yield 0 results
  if (!products || products.length === 0) {
    let fallbackQuery = { title: { $regex: new RegExp(textQuery, "i") } };
    if (attributes.brand) fallbackQuery.brand = { $regex: new RegExp(attributes.brand, "i") };
    if (attributes.color) fallbackQuery["Metadata.color"] = { $regex: new RegExp(attributes.color, "i") };
    products = await Product.find(fallbackQuery).limit(50);
  }

  // 6️⃣ Compute ranking score
  products = products.map((p) => {
    const textScore = p.score || 0;
    const unitsSoldScore = Math.log((p.unitsSold || 1));
    const ratingScore = (p.rating || 0) * 2;
    const stockPenalty = p.stock <= 0 ? -5 : 0;

    return {
      ...p.toObject(),
      _score: textScore * 2 + ratingScore + unitsSoldScore + stockPenalty
    };
  });

  // 7️⃣ Apply comparatives sorting (price, storage, rating)
  products.sort((a, b) => {
    // 🔹 Price order (asc for sasta/cheap, desc for mehnga/expensive)
    if (attributes.priceOrder) {
      console.log(attributes.priceOrder,"-------")
      const priceA = a.price;
      const priceB = b.price;
      return attributes.priceOrder === "asc" ? priceA - priceB : priceB - priceA;
    }

    // 🔹 Storage order (more storage first)
    if (attributes.storageOrder) {
      const getStorageValue = (s) => {
        if (!s) return 0;
        const n = parseInt(s.replace(/[^0-9]/g, ""));
        return isNaN(n) ? 0 : n;
      };
      const storageA = getStorageValue(a.Metadata?.storage);
      const storageB = getStorageValue(b.Metadata?.storage);
      return attributes.storageOrder === "desc" ? storageB - storageA : storageA - storageB;
    }

    // 🔹 Rating order (high rating first)
    if (attributes.ratingOrder) {
      return (b.rating || 0) - (a.rating || 0);
    }

    // 🔹 Default: sort by computed score (_score)
    const scoreDiff = (b._score || 0) - (a._score || 0);
    if (scoreDiff !== 0) return scoreDiff;

    // 🔹 Final tiebreaker: productId
    return a._id.toString().localeCompare(b._id.toString());
  });

  return products;
};
