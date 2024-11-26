import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandle } from '../utils/error.js';
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        next(errorHandle(400, "All fields are required"));
    }

    if (typeof password !== 'string') {
        return res.status(400).json({ message: "Password must be a string" });
    }


    // Hash mật khẩu
    const hashPassword = bcryptjs.hashSync(password, 10);

    // Lưu người dùng mới
    const newUser = new User({
        username,
        email,
        password: hashPassword,
    });
    try {
        await newUser.save();
        res.json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};