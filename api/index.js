import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import routes
import userRoutes from "./routes/user.routes.js";
// import authRoutes from "./routes/auth.routes.js";

const ConnectMongoose = mongoose.connect(process.env.MONGO)
ConnectMongoose.then(() => console.log("MongoDB is connected")).catch(err => console.error('error connect'))
const app = express();

// Sử dụng routes
app.use("/api/users", userRoutes);

// app.use("/api/auth", authRoutes);
app.listen(3000, () => {
    console.log(`Server is runing on Port 3000`);
})
