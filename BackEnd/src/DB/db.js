import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

export const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI environment variable is not set");
        }

        await mongoose.connect(process.env.MONGO_URI, { dbName: DB_NAME });
        console.log(`MongoDB connected.`);
    } catch (err) {
        console.error("MongoDB connection error:", err.message);
        process.exit(1);
    }
};
