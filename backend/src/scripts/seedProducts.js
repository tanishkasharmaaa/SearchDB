require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");

const { faker } = require("@faker-js/faker");

const MONGO_URI = process.env.MONGO_URI;

// ---- CONFIG ----
const TOTAL_PRODUCTS = 1200;

const iphoneModels = [13, 14, 15, 16, 17];
const androidBrands = ["Samsung", "OnePlus", "Xiaomi", "Realme"];
const colors = ["red", "black", "blue", "white", "green"];
const storageOptions = [64, 128, 256, 512];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateIphone() {
  const model = randomFrom(iphoneModels);
  const storage = randomFrom(storageOptions);
  const color = randomFrom(colors);

  const basePrice = 40000 + model * 3000 + storage * 50;

  return {
    title: `Iphone ${model} ${storage}GB ${color}`,
    description: `Apple Iphone ${model} with ${storage}GB storage in ${color} color`,
    category: "mobile",
    brand: "apple",
    model: `iphone ${model}`,

    price: basePrice,
    mrp: basePrice + 5000,
    rating: faker.number.float({ min: 3.5, max: 4.9 }),
    ratingCount: faker.number.int({ min: 50, max: 5000 }),
    unitsSold: faker.number.int({ min: 100, max: 50000 }),
    returnRate: faker.number.float({ min: 0.01, max: 0.1 }),

    stock: faker.number.int({ min: 0, max: 200 }),

    metadata: {
      ram: model >= 15 ? 8 : 6,
      storage,
      color,
      screenSize: 6.1,
      brightness: 300
    }
  };
}

function generateAndroid() {
  const brand = randomFrom(androidBrands);
  const storage = randomFrom(storageOptions);
  const color = randomFrom(colors);

  const basePrice = faker.number.int({ min: 12000, max: 45000 });

  return {
    title: `${brand} Phone ${storage}GB ${color}`,
    description: `${brand} smartphone with ${storage}GB storage and ${color} color`,
    category: "mobile",
    brand: brand.toLowerCase(),
    model: `${brand.toLowerCase()} phone`,

    price: basePrice,
    mrp: basePrice + 3000,
    rating: faker.number.float({ min: 3.2, max: 4.7 }),
    ratingCount: faker.number.int({ min: 20, max: 3000 }),
    unitsSold: faker.number.int({ min: 200, max: 80000 }),
    returnRate: faker.number.float({ min: 0.02, max: 0.15 }),

    stock: faker.number.int({ min: 0, max: 500 }),

    metadata: {
      ram: randomFrom([4, 6, 8, 12]),
      storage,
      color,
      screenSize: faker.number.float({ min: 6.3, max: 6.8 }),
      brightness: faker.number.int({ min: 400, max: 1200 })
    }
  };
}

function generateAccessory() {
  const types = ["Cover", "Charger", "Screen Guard", "Headphones"];
  const type = randomFrom(types);

  return {
    title: `Iphone ${type}`,
    description: `Durable ${type} for Iphone models`,
    category: "accessory",
    brand: "generic",
    model: type.toLowerCase(),

    price: faker.number.int({ min: 299, max: 1999 }),
    mrp: faker.number.int({ min: 999, max: 2999 }),
    rating: faker.number.float({ min: 3.0, max: 4.5 }),
    ratingCount: faker.number.int({ min: 10, max: 5000 }),
    unitsSold: faker.number.int({ min: 100, max: 100000 }),
    returnRate: faker.number.float({ min: 0.01, max: 0.2 }),

    stock: faker.number.int({ min: 0, max: 1000 }),

    metadata: {
      color: randomFrom(colors)
    }
  };
}

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await Product.deleteMany({});
    console.log("Old products removed");

    const products = [];

    for (let i = 0; i < TOTAL_PRODUCTS; i++) {
      if (i % 3 === 0) products.push(generateIphone());
      else if (i % 3 === 1) products.push(generateAndroid());
      else products.push(generateAccessory());
    }

    await Product.insertMany(products);
    console.log(`✅ Inserted ${products.length} products`);

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
