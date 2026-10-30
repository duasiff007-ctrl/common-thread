
const express = require("express");
const Product = require("../models/Product");
const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin dashboard
router.get("/dashboard", protect, adminOnly, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        res.status(200).json({
            success: true,
            message: "Welcome to the Common Thread Admin Dashboard!",
            admin: req.user.name,
            totalProducts: totalProducts
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to load admin dashboard.",
            error: error.message
        });
    }
});

// Add a new product
router.post("/products", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product added successfully!",
            product: product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to add product.",
            error: error.message
        });
    }
});

// Edit an existing product
router.put("/products/:id", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully!",
            product: product
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to update product.",
            error: error.message
        });
    }
});

// Delete a product
router.delete("/products/:id", protect, adminOnly, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully!"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to delete product.",
            error: error.message
        });
    }
});

module.exports = router;
