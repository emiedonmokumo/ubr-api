import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config()

const MONGO_URI = process.env.MONGO_URI;

const connectDB = () => {
    mongoose.connect(MONGO_URI)
        .then(() => {
        console.log("MongoDB connected successfully!");
    })
        .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });
};
export default connectDB;