
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const sampleProducts = [
    {
        name: "Soft Knit Cardigan",
        description: "A relaxed knit cardigan for everyday layering.",
        category: "tops",
        gender: "women",
        price: 3500,
        color: "Dusty Rose",
        stock: 12,
        isFeatured: true
    },
    {
        name: "Classic Linen Shirt",
        description: "A comfortable linen shirt with a timeless fit.",
        category: "tops",
        gender: "men",
        price: 3200,
        color: "Ivory",
        stock: 15,
        isFeatured: true
    },
    {
        name: "Everyday Cotton Tee",
        description: "A simple cotton T-shirt for everyday outfits.",
        category: "tops",
        gender: "unisex",
        price: 1800,
        color: "Warm White",
        stock: 20
    },
    {
        name: "Tailored Wide-Leg Trousers",
        description: "Elegant trousers with a relaxed silhouette.",
        category: "bottoms",
        gender: "women",
        price: 4200,
        color: "Taupe",
        stock: 10,
        isFeatured: true
    },
    {
        name: "Relaxed Fit Chinos",
        description: "Versatile chinos for everyday comfort.",
        category: "bottoms",
        gender: "men",
        price: 3900,
        color: "Olive",
        stock: 14
    },
    {
        name: "Everyday Shoulder Bag",
        description: "A minimal shoulder bag for daily essentials.",
        category: "purses",
        gender: "women",
        price: 4500,
        color: "Chocolate Brown",
        stock: 8,
        isFeatured: true
    },
    {
        name: "Minimalist Sunglasses",
        description: "Classic sunglasses with a warm tortoiseshell finish.",
        category: "sunglasses",
        gender: "unisex",
        price: 2200,
        color: "Tortoiseshell",
        stock: 18
    },
    {
        name: "Classic Square Sunglasses",
        description: "A clean square frame for a timeless look.",
        category: "sunglasses",
        gender: "men",
        price: 2500,
        color: "Black",
        stock: 11
    }
];

async function seedProducts() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB!");

        for (const product of sampleProducts) {
            await Product.updateOne(
                { name: product.name },
                { $set: product },
                { upsert: true }
            );
        }

        console.log("Sample products added successfully!");
        console.log(`${sampleProducts.length} demo products processed.`);
    } catch (error) {
        console.error("Error adding products:", error.message);
    } finally {
        await mongoose.disconnect();
        console.log("Database connection closed.");
    }
}
seedProducts();
