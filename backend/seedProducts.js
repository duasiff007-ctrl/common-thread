
const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const sampleProducts = [
    // WOMEN'S COLLECTION — TOPS
    {
        name: "Soft Knit Cardigan",
        category: "tops",
        gender: "women",
        price: 2800,
        color: "Dusty Rose",
        colorCode: "#C49A9B",
        description: "A relaxed knit cardigan for everyday layering.",
        image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600",
        stock: 12,
        isFeatured: true
    },
    {
        name: "Classic White Shirt",
        category: "tops",
        gender: "women",
        price: 2200,
        color: "Ivory",
        colorCode: "#F1E9DC",
        description: "A timeless button-up shirt with an easy fit.",
        image: "https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600",
        stock: 12
    },
    {
        name: "Everyday Crop Top",
        category: "tops",
        gender: "women",
        price: 1500,
        color: "Taupe",
        colorCode: "#A58F80",
        description: "A simple everyday top with a clean silhouette.",
        image: "https://images.unsplash.com/photo-1564257577-7a4f4a7e0d0e?w=600",
        stock: 15
    },

    // WOMEN'S COLLECTION — BOTTOMS
    {
        name: "Relaxed Straight Jeans",
        category: "bottoms",
        gender: "women",
        price: 3200,
        color: "Denim Blue",
        colorCode: "#75899A",
        description: "Relaxed straight-leg denim for everyday wear.",
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600",
        stock: 10
    },
    {
        name: "Wide Leg Trousers",
        category: "bottoms",
        gender: "women",
        price: 2900,
        color: "Warm Beige",
        colorCode: "#C8B59D",
        description: "Comfortable tailored trousers with a wide-leg shape.",
        image: "https://images.unsplash.com/photo-1506629905607-d9b1d4a6e8d8?w=600",
        stock: 10
    },
    {
        name: "Everyday Midi Skirt",
        category: "bottoms",
        gender: "women",
        price: 2500,
        color: "Muted Plum",
        colorCode: "#927583",
        description: "A versatile midi skirt for relaxed styling.",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a13d27?w=600",
        stock: 10
    },

    // WOMEN'S COLLECTION — PURSES
    {
        name: "Minimal Shoulder Bag",
        category: "purses",
        gender: "women",
        price: 3500,
        color: "Chocolate Brown",
        colorCode: "#765344",
        description: "A simple shoulder bag for daily essentials.",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600",
        stock: 8
    },
    {
        name: "Everyday Tote",
        category: "purses",
        gender: "women",
        price: 2700,
        color: "Natural Beige",
        colorCode: "#CBBBA6",
        description: "A roomy tote with a minimal design.",
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600",
        stock: 8
    },

    // WOMEN'S COLLECTION — SUNGLASSES
    {
        name: "Classic Oval Shades",
        category: "sunglasses",
        gender: "women",
        price: 1800,
        color: "Black",
        colorCode: "#29252A",
        description: "Simple oval sunglasses with a timeless look.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        stock: 12
    },

    // MEN'S COLLECTION — TOPS
    {
        name: "Oversized Cotton Tee",
        category: "tops",
        gender: "men",
        price: 1600,
        color: "Off White",
        colorCode: "#EAE3D9",
        description: "A comfortable oversized cotton T-shirt.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600",
        stock: 15
    },
    {
        name: "Relaxed Linen Shirt",
        category: "tops",
        gender: "men",
        price: 2600,
        color: "Sage Green",
        colorCode: "#9AA895",
        description: "A breathable linen shirt for effortless styling.",
        image: "https://images.unsplash.com/photo-1603252109303-2751441dd157?w=600",
        stock: 12
    },
    {
        name: "Classic Sweatshirt",
        category: "tops",
        gender: "men",
        price: 3000,
        color: "Muted Grey",
        colorCode: "#A6A2A0",
        description: "A relaxed sweatshirt for cooler days.",
        image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
        stock: 10
    },

    // MEN'S COLLECTION — BOTTOMS
    {
        name: "Relaxed Fit Jeans",
        category: "bottoms",
        gender: "men",
        price: 3400,
        color: "Denim Blue",
        colorCode: "#71869B",
        description: "Classic relaxed-fit denim.",
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600",
        stock: 10
    },
    {
        name: "Straight Fit Trousers",
        category: "bottoms",
        gender: "men",
        price: 3100,
        color: "Charcoal",
        colorCode: "#59545A",
        description: "Versatile straight-fit trousers.",
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600",
        stock: 10
    },
    {
        name: "Casual Cotton Shorts",
        category: "bottoms",
        gender: "men",
        price: 1900,
        color: "Stone",
        colorCode: "#B9AA99",
        description: "Easy cotton shorts for relaxed outfits.",
        image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600",
        stock: 12
    },

    // MEN'S COLLECTION — PURSES
    {
        name: "Minimal Crossbody Bag",
        category: "purses",
        gender: "men",
        price: 2800,
        color: "Dark Brown",
        colorCode: "#61483E",
        description: "A practical crossbody bag with a clean design.",
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600",
        stock: 8
    },

    // MEN'S COLLECTION — SUNGLASSES
    {
        name: "Classic Frame Shades",
        category: "sunglasses",
        gender: "men",
        price: 2000,
        color: "Black",
        colorCode: "#29252A",
        description: "Classic everyday sunglasses.",
        image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600",
        stock: 12
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

        console.log("Products added successfully!");
        console.log(`${sampleProducts.length} products processed.`);
    } catch (error) {
        console.error("Error adding products:", error.message);
        process.exitCode = 1;
    } finally {
        if (mongoose.connection.readyState !== 0) {
            await mongoose.disconnect();
        }
        console.log("Database connection closed.");
    }
}

seedProducts();
