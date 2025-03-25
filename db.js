const mongoose = require("mongoose");

// Replace with your actual MongoDB connection URI
const mongoURI = "mongodb://localhost:27017/inotebook";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB successfully!");

        // Optional: Log connection status
        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose disconnected from MongoDB");
        });
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        console.log("Retrying in 5 seconds...");
        setTimeout(connectToMongo, 5000); // Retry connection
    }
};

module.exports = connectToMongo;
