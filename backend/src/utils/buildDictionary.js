async function buildDictionary(Product) {
  const products = await Product.find({}, { title: 1, Metadata: 1 });

  const words = new Set();

  products.forEach(p => {
    p.title
      .toLowerCase()
      .split(/\s+/)
      .forEach(w => {
        const clean = w.replace(/[^a-z]/g, "");
        if (clean.length > 2) words.add(clean);
      });

    // 2️⃣ Extract words from metadata
    if (p.Metadata) {
      Object.values(p.Metadata).forEach(val => {
        if (!val) return;

        const valStr = val.toString().toLowerCase();

        // Split by spaces and add words
        valStr.split(/\s+/).forEach(w => {
          const clean = w.replace(/[^a-z0-9]/g, ""); // keep numbers for storage like 128gb
          if (clean.length > 0) words.add(clean);
        });
      });
    }
  });


  return Array.from(words);
}

module.exports = { buildDictionary };
