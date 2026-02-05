const analyticsService = require("../services/analytics.service");
const normalizeQuery = require("../utils/normalizeQuery");
const searchService = require("../services/search.service");
const { spellCorrectQuery } = require("../utils/spellCorrect");

// ✅ Ensure global dictionary is loaded in server.js
// global.DICTIONARY

exports.searchProducts = async (req, res) => {
  try {
    const rawQuery = req.query.query;

    // 1️⃣ Spell correction first
    const correctedQuery = spellCorrectQuery(rawQuery, global.DICTIONARY);

    // 2️⃣ Normalize query for analytics / intent
    const normalized = normalizeQuery(correctedQuery);

    // 3️⃣ Run search with corrected query
    const results = await searchService.search(correctedQuery);

    // 4️⃣ Log search impressions
    analyticsService.logSearch(rawQuery, normalized, results);

    res.json({
      query: rawQuery,
      correctedQuery, // optional, can be returned for debugging
      data: results
    });
  } catch (err) {
    console.error("Search failed:", err);
    res.status(500).json({ message: "Search failed", error: err.message });
  }
};
