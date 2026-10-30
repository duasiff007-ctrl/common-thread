
const mongoose = require("mongoose");
require("dotenv").config();

const User = require("./models/User");

const makeAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);

        console.log("Connected to MongoDB!");

        const user = await User.findOneAndUpdate(
            { email: "demo@commonthread.test" },
            { role: "admin" },
            { new: true }
        );

        if (!user) {
            console.log("Demo user not found!");
        } else {
            console.log("Admin access granted successfully!");
            console.log("Name:", user.name);
            console.log("Role:", user.role);
        }

    } catch (error) {
        console.log("Error:", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("Database connection closed.");
    }
};

makeAdmin();
