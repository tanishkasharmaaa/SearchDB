const Product = require("../models/Product");

exports.createProduct = async (data) => {
  if (!data.title || !data.price) {
    throw new Error("Title and price required");
  }

  const product = await Product.create(data);
  return product._id;
};

exports.updateMetadata = async ({ productId, Metadata }) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { $set: { metadata: Metadata } },
    { new: true }
  );

  if (!product) throw new Error("Product not found");
  return product;
};
