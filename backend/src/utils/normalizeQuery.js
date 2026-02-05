module.exports = function normalizeQuery(query) {
  return query
    .toLowerCase()
    .replace(/₹|rs|rupees/g, " ")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};
