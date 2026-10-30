
const express = require("express");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get the profile of the logged-in user
router.get("/profile", protect, (req, res) => {
    res.status(200).json({
        success: true,
        message: "You are successfully logged in!",
        user: req.user
    });
});

module.exports = router;
