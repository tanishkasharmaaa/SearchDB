const COLOR_LIST = ["red", "black", "blue", "green", "white", "gold", "silver"];
const STORAGE_REGEX = /(\d+)\s?(gb|tb)/i;
const PRICE_REGEX = /(\d+(?:,\d{3})*)(k|l|lakhs|rupees|₹)?/i;
const RAM_REGEX = /(\d+)\s?gb\s?ram/i;

// Known brands/models
const BRANDS = ["iphone", "samsung", "oneplus", "realme", "xiaomi"];

const PRICE_ASC_KEYWORDS = ["less price", "cheap", "sasta", "sasta wala"];
const PRICE_DESC_KEYWORDS = ["high price", "expensive", "mehnga"];
const MORE_STORAGE_KEYWORDS = ["more storage", "higher storage"];
const HIGH_RATING_KEYWORDS = ["high rating", "best rated"];

function extractAttributes(query) {
  const q = query.toLowerCase();

  // 🔹 Brand detection (case-insensitive)
  let brand = null;
  for (const b of BRANDS) {
    if (q.includes(b)) {
      brand = b.toLowerCase();
      break;
    }
  }

  // 🔹 Color detection (matches "red" or "in red")
  const color = COLOR_LIST.find(c => new RegExp(`\\b${c}\\b`).test(q)) || null;

  // 🔹 Storage detection
  let storage = null;
  const storageMatch = q.match(STORAGE_REGEX);
  if (storageMatch) storage = storageMatch[0].toUpperCase();

  // 🔹 RAM detection
  let ram = null;
  const ramMatch = q.match(RAM_REGEX);
  if (ramMatch) ram = ramMatch[0].toUpperCase();

  // 🔹 Price detection
  let price = null;
  const priceMatch = q.match(PRICE_REGEX);
  if (priceMatch) {
    price = parseInt(priceMatch[1].replace(/,/g, ""));
    const multiplier = priceMatch[2];
    if (multiplier === "k") price *= 1000;
    if (multiplier === "l" || multiplier === "lakhs") price *= 100000;
  }

  // 🔹 Comparatives
  const priceOrder = PRICE_ASC_KEYWORDS.some(k => q.includes(k))
    ? "asc"
    : PRICE_DESC_KEYWORDS.some(k => q.includes(k))
    ? "desc"
    : null;

  const storageOrder = MORE_STORAGE_KEYWORDS.some(k => q.includes(k)) ? "desc" : null;
  const ratingOrder = HIGH_RATING_KEYWORDS.some(k => q.includes(k)) ? "desc" : null;
console.log(brand, color, storage, ram, price, priceOrder, storageOrder, ratingOrder)
  return { brand, color, storage, ram, price, priceOrder, storageOrder, ratingOrder };
}

module.exports = { extractAttributes };
