const products = new Map();
let currentId = 1;

function addProduct(product) {
  const id = currentId++;
  products.set(id, { productId: id, ...product });
  return id;
}

function updateMetadata(productId, metadata) {
  const product = products.get(productId);
  if (!product) return null;

  product.metadata = {
    ...product.metadata,
    ...metadata
  };

  return product;
}

function getAllProducts() {
  return Array.from(products.values());
}

module.exports = {
  addProduct,
  updateMetadata,
  getAllProducts
};
