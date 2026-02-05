const analyticsService = require("../services/analytics.service");
const normalizeQuery = require("../utils/normalizeQuery");
const searchService = require("../services/search.service");
const { spellCorrectQuery } = require("../utils/spellCorrect");


exports.searchProducts = async (req, res) => {
  try {
    const rawQuery = req.query.query;

  
    const correctedQuery = spellCorrectQuery(rawQuery, global.DICTIONARY);

    const normalized = normalizeQuery(correctedQuery);

    const results = await searchService.search(correctedQuery);

    analyticsService.logSearch(rawQuery, normalized, results);

    res.json({
      query: rawQuery,
      correctedQuery, 
      data: results
    });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
