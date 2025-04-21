const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);
const fetch = require("node-fetch");

const Product = require("./model/product");
const User = require("./model/user");
const Cart = require("./model/cart");

const connectDB = async () => {
  try {
    console.log("Connecting to database...");
    await mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

const clearDatabase = async () => {
  try {
    console.log("Clearing existing data...");
    await Product.deleteMany({});
    await User.deleteMany({});
    await Cart.deleteMany({});
    console.log("Database cleared successfully");
  } catch (error) {
    console.error("Failed to clear database:", error.message);
    process.exit(1);
  }
};

const fetchProductsFromAPI = async () => {
  try {
    console.log("Fetching products from FakeStoreAPI...");
    const response = await fetch("https://fakestoreapi.com/products");
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    const products = await response.json();
    console.log(`Successfully fetched ${products.length} products`);
    return products;
  } catch (error) {
    console.error("Error fetching products:", error.message);
    // Return sample data as fallback
    console.log("Using fallback sample products data");
    return sampleProducts;
  }
};

const fetchUsersFromAPI = async () => {
  try {
    console.log("Fetching users from FakeStoreAPI...");
    const response = await fetch("https://fakestoreapi.com/users");
    if (!response.ok) {
      throw new Error(`Failed to fetch users: ${response.statusText}`);
    }
    const users = await response.json();
    console.log(`Successfully fetched ${users.length} users`);
    return users;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    // Return sample data as fallback
    console.log("Using fallback sample users data");
    return sampleUsers;
  }
};

const fetchCartsFromAPI = async () => {
  try {
    console.log("Fetching carts from FakeStoreAPI...");
    const response = await fetch("https://fakestoreapi.com/carts");
    if (!response.ok) {
      throw new Error(`Failed to fetch carts: ${response.statusText}`);
    }
    const carts = await response.json();
    console.log(`Successfully fetched ${carts.length} carts`);
    return carts;
  } catch (error) {
    console.error("Error fetching carts:", error.message);
    // Return sample data as fallback
    console.log("Using fallback sample carts data");
    return sampleCarts;
  }
};

const seedDatabase = async () => {
  try {
    // Fetch data from API
    const products = await fetchProductsFromAPI();
    const users = await fetchUsersFromAPI();
    const carts = await fetchCartsFromAPI();

    console.log("Seeding products...");
    await Product.insertMany(products);
    console.log("Seeding users...");
    await User.insertMany(users);
    console.log("Seeding carts...");
    await Cart.insertMany(carts);
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Failed to seed database:", error.message);
    process.exit(1);
  }
};

const seed = async () => {
  try {
    await connectDB();
    await clearDatabase();
    await seedDatabase();
    console.log("Seed completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

// Run seed
seed();
