module.exports = function cleanTextQuery(query) {
  return query.replace(/\b\d+\s?k\b/g, "").trim();
};
