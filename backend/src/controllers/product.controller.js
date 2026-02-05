exports.createProduct = async (req, res) => {
  try {
    const productId = await productService.createProduct(req.body);
    res.json({ productId });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateProductMetadata = async (req, res) => {
  try {
    const product = await productService.updateMetadata(req.body);
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
