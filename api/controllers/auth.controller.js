import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandle } from '../utils/error.js';
import jwt from 'jsonwebtoken';
export const signup = async (req, res, next) => {

    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandle(400, "All fields are required"));
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
export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password || email.trim() === '' || password.trim() === '') {
        return next(errorHandle(400, "All fields are required"));
    }

    try {
        // Kiểm tra email có tồn tại
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandle(404, "User not found"));
        }

        // Kiểm tra mật khẩu
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandle(400, "Password is incorrect"));
        }

        // Tạo token JWT
        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" } // Token có hiệu lực trong 1 giờ
        );

        // Loại bỏ password khỏi kết quả trả về
        const { password: pass, ...user } = validUser._doc;

        // Gửi token trong cookie
        res.cookie("access_token", token, {
            httpOnly: true, // Ngăn chặn JavaScript truy cập cookie
            secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: "strict", // Ngăn chặn tấn công CSRF
        }).status(200).json({
            message: "Login successfully",
            user,
        });
    } catch (error) {
        next(error); // Xử lý lỗi bằng middleware
    }
};