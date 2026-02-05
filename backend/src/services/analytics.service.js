const SearchAnalytics = require("../models/SearchAnalytics");

exports.logSearch = async (query, normalizedQuery, products) => {
  const logs = products.map((p, index) => ({
    query,
    normalizedQuery,
    productId: p._id,
    position: index + 1,
    type: "SEARCH"
  }));

  await SearchAnalytics.insertMany(logs);
};

exports.logClick = async (query, productId, position) => {
  await SearchAnalytics.create({
    query,
    productId,
    position,
    type: "CLICK"
  });
};

