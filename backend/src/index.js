require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { buildDictionary } = require("./utils/buildDictionary");
const Product = require("./models/Product");

const productRoutes = require("./routes/product.routes");
const searchRoutes = require("./routes/search.routes");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory dictionary
global.DICTIONARY = [];

async function startServer() {
  try {
    await connectDB();
    console.log("MongoDB connected");

    global.DICTIONARY = await buildDictionary(Product);
    console.log("Dictionary size:", global.DICTIONARY.length);
    console.log("Contains iphone:", global.DICTIONARY.includes("iphone"));

    app.use("/api/v1/product", productRoutes);
    app.use("/api/v1/search", searchRoutes);

    app.get("/health", (_, res) => res.send("OK"));

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`)
    );

  } catch (err) {
    console.error("Failed to start server", err);
    process.exit(1);
  }
}

startServer();
