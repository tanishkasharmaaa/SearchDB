module.exports = function cleanTextQuery(query) {
  // remove price tokens like 50k, 30k, 100k
  return query.replace(/\b\d+\s?k\b/g, "").trim();
};
