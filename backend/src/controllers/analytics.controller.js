const analyticsService = require("../services/analytics.service");

exports.logClick = async (req, res) => {
  try {
    const { query, productId, position } = req.body;

    await analyticsService.logClick(query, productId, position);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
