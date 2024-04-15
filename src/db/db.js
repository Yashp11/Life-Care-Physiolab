import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();


const MONGODB_URL=process.env.MONGODB_URL;
const DB_NAME=process.env.DB_NAME;

 const connectDB = async () => {
    try {
        await mongoose.connect(`${MONGODB_URL}/${DB_NAME}`);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};


export default connectDB;
