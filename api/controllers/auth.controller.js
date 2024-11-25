import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (typeof password !== 'string') {
        return res.status(400).json({ message: "Password must be a string" });
    }

    try {
        // Hash mật khẩu
        const hashPassword = bcryptjs.hashSync(password, 10);

        // Lưu người dùng mới
        const newUser = new User({
            username,
            email,
            password: hashPassword,
        });

        await newUser.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        console.error("Error during user creation:", error);
        if (error.code === 11000) {
            return res.status(400).json({ message: "Email or username already exists" });
        }
        return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
};