module.exports = function parseIntent(query) {
  const intent = {};

  // Price intent
  if (query.includes("sasta") || query.includes("cheap") || query.includes("kam daam")) {
    intent.sortBy = "price_asc";
  }

  // Latest intent
  if (query.includes("latest") || query.includes("new")) {
    intent.sortBy = "latest";
  }

  // Storage intent
  if (query.includes("more storage")) {
    intent.sortBy = "storage_desc";
  }

  // Color intent
  const colors = ["red", "black", "blue", "white", "green"];
  colors.forEach(color => {
    if (query.includes(color)) intent.color = color;
  });

  // Budget like "50k"
  const priceMatch = query.match(/(\d+)\s?k/);
  if (priceMatch) {
    intent.maxPrice = Number(priceMatch[1]) * 1000;
  }

  // Brand
  if (query.includes("iphone")) {
    intent.brand = "apple";
  }

  return intent;
};
