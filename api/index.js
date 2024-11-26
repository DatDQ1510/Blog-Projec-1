import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Import routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
const MONGO = process.env.MONGO;
const ConnectMongoose = mongoose.connect(MONGO);
ConnectMongoose.then(() => console.log("MongoDB is connected")).catch(err => console.error('error connect'))
const app = express();

app.use(express.json());

// Sử dụng routes
app.use("/api/users", userRoutes);

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is runing on Port 3000`);
    // console.log(MONGO);
})

app.use((err, req, res, next) => {
    const statusCode = res.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json(
        {
            success: false,
            statusCode,
            message
        }
    )
})
