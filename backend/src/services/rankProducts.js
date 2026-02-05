const clickBoostService = require("./clickBoost.service");

module.exports = async function rankProducts(products, intent, query) {
  const clickBoost = await clickBoostService.getClickBoostMap(query);

  return products
    .map(p => {
      let score = 0;

      score += (p.score || 1) * 3;
      score += (p.rating || 0) * 2;
      score += Math.log((p.unitsSold || 1));

      const boost = clickBoost[p._id.toString()] || 0;
      score += boost * 5;

      if (p.stock <= 0) score -= 5;

      return { ...p.toObject(), _finalScore: score };
    })
    .sort((a, b) => b._finalScore - a._finalScore)
    .slice(0, 20);
};
