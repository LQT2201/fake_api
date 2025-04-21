const mongoose = require("mongoose");
const dotenv = require("dotenv");
const dotenvExpand = require("dotenv-expand");
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

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

const sampleProducts = [
  {
    id: 1,
    title: "Fjallraven - Foldsack No. 1 Backpack",
    price: 109.95,
    description:
      "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
  },
  {
    id: 2,
    title: "Mens Casual Premium Slim Fit T-Shirts",
    price: 22.3,
    description:
      "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing.",
    category: "men's clothing",
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
  },
  {
    id: 3,
    title: "Mens Cotton Jacket",
    price: 55.99,
    description:
      "Great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors.",
    category: "men's clothing",
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
  },
  {
    id: 4,
    title: "Womens Casual Slim Fit",
    price: 15.99,
    description:
      "The color could be slightly different between on the screen and in practice.",
    category: "women's clothing",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
  },
  {
    id: 5,
    title:
      "John Hardy Women's Legends Naga Gold & Silver Dragon Station Chain Bracelet",
    price: 695,
    description:
      "From our Legends Collection, the Naga was inspired by the mythical water dragon that protects the ocean's pearl.",
    category: "jewelery",
    image: "https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg",
  },
];

const sampleUsers = [
  {
    id: 1,
    email: "john@example.com",
    username: "johnd",
    password: "m38rmF$",
    name: {
      firstname: "John",
      lastname: "Doe",
    },
    address: {
      city: "kilcoole",
      street: "7835 new road",
      number: 3,
      zipcode: "12926-3874",
      geolocation: {
        lat: "-37.3159",
        long: "81.1496",
      },
    },
    phone: "1-570-236-7033",
  },
  {
    id: 2,
    email: "morrison@example.com",
    username: "mor_2314",
    password: "83r5^_",
    name: {
      firstname: "David",
      lastname: "Morrison",
    },
    address: {
      city: "Kilcoole",
      street: "Lovers Ln",
      number: 7267,
      zipcode: "12926-3874",
      geolocation: {
        lat: "-37.3159",
        long: "81.1496",
      },
    },
    phone: "1-570-236-7033",
  },
];

const sampleCarts = [
  {
    id: 1,
    userId: 1,
    date: new Date("2020-03-02T00:00:00.000Z"),
    products: [
      {
        productId: 1,
        quantity: 4,
      },
      {
        productId: 2,
        quantity: 1,
      },
      {
        productId: 3,
        quantity: 6,
      },
    ],
  },
  {
    id: 2,
    userId: 1,
    date: new Date("2020-01-02T00:00:00.000Z"),
    products: [
      {
        productId: 2,
        quantity: 4,
      },
      {
        productId: 1,
        quantity: 10,
      },
      {
        productId: 5,
        quantity: 2,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    console.log("Seeding products...");
    await Product.insertMany(sampleProducts);
    console.log("Seeding users...");
    await User.insertMany(sampleUsers);
    console.log("Seeding carts...");
    await Cart.insertMany(sampleCarts);
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
