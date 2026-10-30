
const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get the logged-in user's cart
router.get("/", protect, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate("items.product");

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        res.status(200).json({
            success: true,
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to fetch cart.",
            error: error.message
        });
    }
});

// Add a product to the cart
router.post("/add", protect, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const amount = quantity === undefined ? 1 : Number(quantity);

        if (!productId || !Number.isInteger(amount) || amount < 1) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid product ID and quantity."
            });
        }

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        if (amount > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Not enough stock available."
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: []
            });
        }

        const existingItem = cart.items.find(
            item => item.product.toString() === productId
        );

        if (existingItem) {
            if (existingItem.quantity + amount > product.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Not enough stock available."
                });
            }

            existingItem.quantity += amount;
        } else {
            cart.items.push({
                product: productId,
                quantity: amount
            });
        }

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product added to cart!",
            cart
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to add product to cart.",
            error: error.message
        });
    }
});

// Update the quantity of a cart item
router.put("/update/:productId", protect, async (req, res) => {
    try {
        const { quantity } = req.body;

        if (!Number.isInteger(quantity) || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a whole number greater than zero."
            });
        }

        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        const item = cart.items.find(
            item => item.product.toString() === req.params.productId
        );

        if (!item) {
            return res.status(404).json({
                success: false,
                message: "Product is not in your cart."
            });
        }

        const product = await Product.findById(req.params.productId);

        if (!product || quantity > product.stock) {
            return res.status(400).json({
                success: false,
                message: "Requested quantity is not available."
            });
        }

        item.quantity = quantity;

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Cart quantity updated!",
            cart
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Unable to update cart.",
            error: error.message
        });
    }
});

// Remove one product from the cart
router.delete("/remove/:productId", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        cart.items = cart.items.filter(
            item => item.product.toString() !== req.params.productId
        );

        await cart.save();
        await cart.populate("items.product");

        res.status(200).json({
            success: true,
            message: "Product removed from cart!",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to remove product.",
            error: error.message
        });
    }
});

// Empty the entire cart
router.delete("/clear", protect, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found."
            });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({
            success: true,
            message: "Your cart has been cleared!",
            cart
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Unable to clear cart.",
            error: error.message
        });
    }
});

module.exports = router;
