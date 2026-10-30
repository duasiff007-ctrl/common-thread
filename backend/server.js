const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const outfitRoutes = require("./routes/outfitRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

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

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `Common Thread server running at http://localhost:${PORT}`
            );
        });
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error.message);
    });
