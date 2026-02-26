import mongoose from "mongoose";

const connectDB = async () => {
    mongoose.connection.on("connected", () => {
        console.log("MongoDB connected successfully");
    });
    await mongoose.connect("mongodb://localhost:27017/mern-auth");
}

export default connectDB;
