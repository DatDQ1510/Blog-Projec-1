import express from 'express';
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import cookieParser from 'cookie-parser';
dotenv.config();
// Import routes
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import postRoutes from "./routes/post.routes.js";

const corsOptions = {
    origin: 'http://localhost:5173',  // URL của frontend
    credentials: true,  // Cho phép gửi cookie
};


const MONGO = process.env.MONGO;
const ConnectMongoose = mongoose.connect(MONGO);
ConnectMongoose.then(() => console.log("MongoDB is connected")).catch(err => console.error('error connect'))
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// Sử dụng routes
app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/post", postRoutes);

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is runing on Port ${PORT}`);
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
