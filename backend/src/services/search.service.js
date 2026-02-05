const Product = require("../models/Product");
const { spellCorrectQuery } = require("../utils/spellCorrect");
const { extractAttributes } = require("../utils/extractAttributes");
const normalizeQuery = require("../utils/normalizeQuery");
const cleanTextQuery = require("../utils/cleanTextQuery");

const escapeRegex = (text) =>
  text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

exports.search = async (rawQuery) => {
  const normalized = normalizeQuery(rawQuery);
  const correctedQuery = spellCorrectQuery(normalized, global.DICTIONARY);

  const attributes = extractAttributes(correctedQuery);
  console.log(attributes);

  const textQuery = cleanTextQuery(correctedQuery);

  const conditions = [];

  // Text search
  if (textQuery.length > 0) {
    conditions.push({ $text: { $search: textQuery } });
  }

  // Brand OR title match
  if (attributes.brand) {
    const safeBrand = escapeRegex(attributes.brand);

    conditions.push({
      $or: [
        { brand: { $regex: safeBrand, $options: "i" } },
        { title: { $regex: safeBrand, $options: "i" } }
      ]
    });
  }

  // Title keywords
  if (attributes.titleKeywords) {
    const words = attributes.titleKeywords
      .split(" ")
      .map(w => escapeRegex(w))
      .filter(Boolean);

    if (words.length > 0) {
      conditions.push({
        title: {
          $regex: words.join("|"),
          $options: "i"
        }
      });
    }
  }

  //  Color
  if (attributes.color) {
    const safeColor = escapeRegex(attributes.color);

    conditions.push({
      "metadata.color": { $regex: safeColor, $options: "i" }
    });
  }

  //  Storage
  if (attributes.storage) {
    const storageValue = parseInt(
      attributes.storage.replace(/[^0-9]/g, "")
    );

    if (!isNaN(storageValue)) {
      conditions.push({ "metadata.storage": storageValue });
    }
  }

  // RAM
  if (attributes.ram) {
    const ramValue = parseInt(
      attributes.ram.replace(/[^0-9]/g, "")
    );

    if (!isNaN(ramValue)) {
      conditions.push({ "metadata.ram": ramValue });
    }
  }

  // Auto price intent detection
  let autoPriceOrder = null;

  if (!attributes.priceOrder) {
    if (attributes.maxPrice && !attributes.minPrice) {
      autoPriceOrder = "asc";
    } else if (attributes.minPrice && !attributes.maxPrice) {
      autoPriceOrder = "desc";
    }
  }

  const mongoQuery =
    conditions.length > 0 ? { $and: conditions } : {};

    
let mongoSort = {};

if (attributes.priceOrder === "asc") {
  mongoSort.price = 1;
}
else if (attributes.priceOrder === "desc") {
  mongoSort.price = -1;
}
else if (attributes.minPrice && attributes.maxPrice) {
  mongoSort.price = 1; 
}
else if (attributes.maxPrice && !attributes.minPrice) {
  mongoSort.price = 1; 
}
else if (attributes.minPrice && !attributes.maxPrice) {
  mongoSort.price = -1; 
}
else if (textQuery.length > 0) {
  mongoSort = { score: { $meta: "textScore" } };
}

console.log("MONGO SORT:", mongoSort);


let products = await Product.find(
  mongoQuery,
  textQuery.length > 0
    ? { score: { $meta: "textScore" } }
    : {}
)
.sort(mongoSort)
.limit(300)
.lean();

  if (attributes.minPrice || attributes.maxPrice) {
    products = products.filter(p => {
      const price = Number(p.price);

      if (!price || isNaN(price)) return false;

      if (attributes.minPrice && price < attributes.minPrice)
        return false;

      if (attributes.maxPrice && price > attributes.maxPrice)
        return false;

      return true;
    });
  }


  if ((!products || products.length === 0) && textQuery.length > 0) {
    const safeText = escapeRegex(textQuery);

    products = await Product.find({
      title: { $regex: safeText, $options: "i" }
    })
      .lean();
  }

  //  Ranking
  products = products.map((p) => {
    const textScore = (p.score || 1) * 3;

    const popularityScore = Math.log(
      (p.unitsSold || 1) + 1
    );

    const ratingScore =
      (p.rating || 0) *
      Math.log((p.ratingCount || 1) + 1);

    let priceIntentScore = 0;

    const finalPriceOrder =
      attributes.priceOrder || autoPriceOrder;

    if (finalPriceOrder === "asc") {
      priceIntentScore = 100000 / (p.price || 1);
    } else if (finalPriceOrder === "desc") {
      priceIntentScore = (p.price || 0) / 10000;
    }

    const availabilityScore =
      p.stock <= 0
        ? -10
        : Math.log((p.stock || 1) + 1);

    const createdAt = p.createdAt
      ? new Date(p.createdAt)
      : new Date();

    const ageInDays =
      (Date.now() - createdAt) /
      (1000 * 60 * 60 * 24);

    const freshnessBoost =
      ageInDays > 0 ? 5 / ageInDays : 5;

    const finalScore =
      textScore +
      popularityScore +
      ratingScore +
      priceIntentScore +
      availabilityScore +
      freshnessBoost;

    return {
      ...p,
      _score: finalScore
    };
  });


const mongoSortedByPrice =
  mongoSort.price !== undefined;

if (!mongoSortedByPrice) {
  products.sort((a, b) => {

    if (attributes.storageOrder) {
      return (b.metadata?.storage || 0) -
             (a.metadata?.storage || 0);
    }

    if (attributes.ratingOrder) {
      return (b.rating || 0) - (a.rating || 0);
    }

    const scoreDiff =
      (b._score || 0) - (a._score || 0);

    if (scoreDiff !== 0) return scoreDiff;

    return a._id
      .toString()
      .localeCompare(b._id.toString());
  });
}

  console.log(products.map(p => p.price));

  return products;
};
