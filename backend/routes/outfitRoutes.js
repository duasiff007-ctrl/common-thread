
const express = require("express");
const Outfit = require("../models/Outfit");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Save a new outfit
router.post("/", protect, async (req, res) => {
    try {
        const { name, products, notes } = req.body;

        if (!name || !name.trim()) {
            return res.status(400).json({
                success: false,
                message: "Please provide an outfit name."
            });
        }

        if (!Array.isArray(products) || products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please add at least one product to your outfit."
            });
        }

        const validProducts = await Product.find({
            _id: { $in: products }
        });

        if (validProducts.length !== new Set(products).size) {
            return res.status(400).json({
                success: false,
                message: "One or more products could not be found."
            });
        }

        const outfit = await Outfit.create({
            user: req.user._id,
            name: name.trim(),
            products,
            notes: notes || ""
        });

        await outfit.populate("products");

        res.status(201).json({
            success: true,
            message: "Outfit saved successfully!",
            outfit
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to save outfit.",
            error: error.message
        });
    }
});

// View all outfits belonging to the logged-in user
router.get("/", protect, async (req, res) => {
    try {
        const outfits = await Outfit.find({
            user: req.user._id
        })
            .populate("products")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: outfits.length,
            outfits
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch saved outfits.",
            error: error.message
        });
    }
});

// View one saved outfit
router.get("/:id", protect, async (req, res) => {
    try {
        const outfit = await Outfit.findOne({
            _id: req.params.id,
            user: req.user._id
        }).populate("products");

        if (!outfit) {
            return res.status(404).json({
                success: false,
                message: "Outfit not found."
            });
        }

        res.status(200).json({
            success: true,
            outfit
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to fetch outfit.",
            error: error.message
        });
    }
});

// Update a saved outfit
router.put("/:id", protect, async (req, res) => {
    try {
        const { name, products, notes } = req.body;

        const updates = {};

        if (name !== undefined) {
            if (typeof name !== "string" || !name.trim()) {
                return res.status(400).json({
                    success: false,
                    message: "Outfit name cannot be empty."
                });
            }

            updates.name = name.trim();
        }

        if (products !== undefined) {
            if (!Array.isArray(products) || products.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "An outfit must contain at least one product."
                });
            }

            const validProducts = await Product.find({
                _id: { $in: products }
            });

            if (validProducts.length !== new Set(products).size) {
                return res.status(400).json({
                    success: false,
                    message: "One or more products could not be found."
                });
            }

            updates.products = products;
        }

        if (notes !== undefined) {
            updates.notes = notes;
        }

        const outfit = await Outfit.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id
            },
            updates,
            {
                returnDocument: "after",
                runValidators: true
            }
        ).populate("products");

        if (!outfit) {
            return res.status(404).json({
                success: false,
                message: "Outfit not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Outfit updated successfully!",
            outfit
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to update outfit.",
            error: error.message
        });
    }
});

// Delete a saved outfit
router.delete("/:id", protect, async (req, res) => {
    try {
        const outfit = await Outfit.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!outfit) {
            return res.status(404).json({
                success: false,
                message: "Outfit not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Outfit deleted successfully!"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to delete outfit.",
            error: error.message
        });
    }
});

module.exports = router;
