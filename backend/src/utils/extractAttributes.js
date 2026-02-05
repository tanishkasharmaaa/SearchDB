const COLOR_LIST = ["red", "black", "blue", "green", "white", "gold", "silver"];
const STORAGE_REGEX = /(\d+)\s?(gb|tb)/i;
const RAM_REGEX = /(\d+)\s?gb\s?ram/i;

// Known brands
const BRANDS = ["iphone", "samsung", "oneplus", "realme", "xiaomi"];

const STOP_WORDS = [
  "cheapest","cheap","expensive","sasta","sastha",
  "mehnga","mehanga","low","high","price","cost",
  "under","above","between","to","and","phone","in","with","storage","more","best rated","best","latest","model"
];

const PRICE_ASC_KEYWORDS = ["less price", "cheap", "sasta", "sasta wala"];
const PRICE_DESC_KEYWORDS = ["high price", "expensive", "mehnga"];
const MORE_STORAGE_KEYWORDS = ["more storage", "higher storage","high storage","less storage"];
const HIGH_RATING_KEYWORDS = ["high rating", "best rated", "best"];

function normalizePrice(value, multiplier) {
  if (!value) return null;

  let price = parseInt(value.replace(/,/g, "").trim());
  if (isNaN(price)) return null;

  if (!multiplier) return price;

  multiplier = multiplier.toLowerCase();
  if (multiplier === "k") price *= 1000;
  else if (multiplier === "l" || multiplier === "lakhs") price *= 100000;

  return price;
}

function extractAttributes(query) {
  let q = query.toLowerCase().trim();
  console.log("QUERY:", q);

  // ---------------- BRAND ----------------
  let brand = null;
  for (const b of BRANDS) {
    if (q.includes(b)) {
      brand = b;
      q = q.replace(b, "");
      break;
    }
  }

  // ---------------- COLOR ----------------
  let color = null;
  for (const c of COLOR_LIST) {
    const regex = new RegExp(`\\b${c}\\b`);
    if (regex.test(q)) {
      color = c;
      q = q.replace(regex, "");
      break;
    }
  }

  // ---------------- STORAGE / RAM ----------------
  let storage = null;
  let ram = null;
  const storageMatch = q.match(STORAGE_REGEX);
  if (storageMatch) {
    const value = parseInt(storageMatch[1]);
    if (value <= 16) ram = storageMatch[0].toUpperCase();
    else storage = storageMatch[0].toUpperCase();
    q = q.replace(storageMatch[0], "");
  }

  // ---------------- PRICES ----------------
  let minPrice = null;
  let maxPrice = null;
  const allPrices = [...q.matchAll(/(\d+(?:,\d{3})*)\s?(k|l|lakhs|₹)?/gi)];

  const isValidPrice = (value, multiplier) => {
    const num = parseInt(value.replace(/,/g, ""));
    return multiplier || num >= 1000;
  };

  // Range: "between 30k and 60k"
  if (
    allPrices.length >= 2 &&
    q.includes("between") &&
    isValidPrice(allPrices[0][1], allPrices[0][2]) &&
    isValidPrice(allPrices[1][1], allPrices[1][2])
  ) {
    minPrice = normalizePrice(allPrices[0][1], allPrices[0][2]);
    maxPrice = normalizePrice(allPrices[1][1], allPrices[1][2]);
    q = q.replace(allPrices[0][0], "").replace(allPrices[1][0], "");
  } 
  // Single price: "under 40k" / "above 50k" / "40k"
  else if (allPrices.length >= 1 && isValidPrice(allPrices[0][1], allPrices[0][2])) {
    const price = normalizePrice(allPrices[0][1], allPrices[0][2]);
    if (q.includes("under")) maxPrice = price;
    else if (q.includes("above")) minPrice = price;
    else maxPrice = price;
    q = q.replace(allPrices[0][0], "");
  }

  // ---------------- STOP WORDS ----------------
  STOP_WORDS.forEach(word => {
    q = q.replace(new RegExp(`\\b${word}\\b`, "g"), "");
  });

  const titleKeywords = q.trim().replace(/\s+/g, " ");

  // ---------------- SORT ORDERS ----------------
  const priceOrder = PRICE_ASC_KEYWORDS.some(k => query.toLowerCase().includes(k))
    ? "asc"
    : PRICE_DESC_KEYWORDS.some(k => query.toLowerCase().includes(k))
    ? "desc"
    : null;

  const storageOrder = MORE_STORAGE_KEYWORDS.some(k => query.toLowerCase().includes(k))
    ? "desc"
    : null;

  const ratingOrder = HIGH_RATING_KEYWORDS.some(k => query.toLowerCase().includes(k))
    ? "desc"
    : null;



  return {
    brand,
    color,
    storage,
    ram,
    minPrice,
    maxPrice,
    titleKeywords,
    priceOrder,
    storageOrder,
    ratingOrder
  };
}

module.exports = { extractAttributes };
