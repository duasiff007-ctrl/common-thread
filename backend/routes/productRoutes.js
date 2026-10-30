
const express = require("express");
const Product = require("../models/Product");

const router = express.Router();
console.log("PRODUCT ROUTES LOADED SUCCESSFULLY!");

// Get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            products: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch products.",
            error: error.message
        });
    }
});

// Get one product by ID
router.get("/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        res.status(200).json({
            success: true,
            product: product
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch product.",
            error: error.message
        });
    }
});

module.exports = router;
