
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

// Import API routes
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cartRoutes = require("./routes/cartRoutes");
const outfitRoutes = require("./routes/outfitRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB when a request arrives
let connectionPromise;

const connectDB = async (req, res, next) => {
    try {
        if (mongoose.connection.readyState !== 1) {
            if (!connectionPromise) {
                connectionPromise = mongoose.connect(
                    process.env.MONGODB_URI
                ).catch((error) => {
                    connectionPromise = null;
                    throw error;
                });
            }

            await connectionPromise;
        }

        next();
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);

        res.status(500).json({
            success: false,
            message: "Database connection failed."
        });
    }
};

app.use(connectDB);

// API Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/outfits", outfitRoutes);

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to Common Thread Backend!");
});

// Test API route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "Common Thread backend is working!"
    });
});

// Start a local server only when running this file directly
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(
            `Common Thread server running at http://localhost:${PORT}`
        );
    });
}

// Export Express app for Vercel
module.exports = app;
