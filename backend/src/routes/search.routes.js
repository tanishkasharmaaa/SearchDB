const express = require("express");
const router = express.Router();
const { searchProducts } = require("../controllers/search.controller");
const { logClick } = require("../controllers/analytics.controller");

router.get("/product", searchProducts);
router.post("/click", logClick);

module.exports = router;
