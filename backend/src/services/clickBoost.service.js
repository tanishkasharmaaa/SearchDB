const SearchAnalytics = require("../models/SearchAnalytics");

exports.getClickBoostMap = async (query) => {
  const clicks = await SearchAnalytics.aggregate([
    { $match: { query, type: "CLICK" } },
    {
      $group: {
        _id: "$productId",
        clicks: { $sum: 1 }
      }
    }
  ]);

  const boostMap = {};
  clicks.forEach(c => {
    boostMap[c._id.toString()] = Math.log(c.clicks + 1);
  });

  return boostMap;
};
