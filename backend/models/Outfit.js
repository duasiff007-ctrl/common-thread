
const mongoose = require("mongoose");

const outfitSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        products: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            }
        ],

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

const Outfit = mongoose.model("Outfit", outfitSchema);

module.exports = Outfit;
