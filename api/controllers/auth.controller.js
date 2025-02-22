import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandle } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
export const signup = async (req, res, next) => {

    const { username, email, password } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!username || !email || !password || username === '' || email === '' || password === '') {
        return next(errorHandle(400, "All fields are required"));
    }

    // if (typeof password !== 'string') {
    //     return res.status(400).json({ message: "Password must be a string" });
    // }
    // Hash mật khẩu
    const hashPassword = bcryptjs.hashSync(password, 10);

    // Lưu người dùng mới
    const newUser = new User({
        username: username,
        email: email,
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
            {
                id: validUser._id.toString(), // Chuyển `_id` thành `id` trong token
                email: validUser.email,
                username: validUser.username,
                isAdmin: validUser.isAdmin,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Loại bỏ password khỏi kết quả trả về và đồng nhất dữ liệu
        const { password: pass, _id, ...user } = validUser._doc;
        const formattedUser = {
            ...user,
            id: _id.toString(), // Thêm trường `id` đồng nhất thay vì `_id`
        };

        // Gửi token trong cookie
        res.cookie("access_token", token, {
            httpOnly: true, // Ngăn chặn JavaScript truy cập cookie
            secure: process.env.NODE_ENV === "production", // Chỉ gửi cookie qua HTTPS trong môi trường production
            sameSite: "strict", // Ngăn chặn tấn công CSRF
        }).status(200).json({
            message: "Login successfully",
            user: formattedUser, // Trả về user đã chuẩn hóa
            token,
        });
    } catch (error) {
        next(error); // Xử lý lỗi bằng middleware
    }
};

// Kiểm tra trạng thái đăng nhập
export const checkAuthStatus = async (req, res, next) => {
    try {
        // Lấy token từ cookie
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated", loggedIn: false });
        }

        // Giải mã token và kiểm tra
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        res.status(200).json({
            message: "Authenticated", loggedIn: true, email: decoded.email,
            id: decoded.id, username: decoded.username, isAdmin: decoded.isAdmin
        });
    } catch (error) {
        next(errorHandle(403, "Token is invalid or expired"));
    }
};
// Đăng xuất
export const signout = (req, res) => {
    res.clearCookie('access_token', { httpOnly: true, secure: process.env.NODE_ENV === "production" })
        .status(200)
        .json({ message: "Logged out successfully" });
};
// Thay đổi mật khẩu
export const changePassword = async (req, res, next) => {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Validate input
    if (!oldPassword || !newPassword || !confirmPassword) {
        return next(errorHandle(400, "All fields are required"));
    }

    if (newPassword !== confirmPassword) {
        return next(errorHandle(400, "New password and confirm password do not match"));
    }

    try {
        // Get the token from the cookies
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user by username (from the decoded token)
        const user = await User.findOne({ username: decoded.username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the old password matches the current password in the database
        const isMatch = bcryptjs.compareSync(oldPassword, user.password);

        if (!isMatch) {
            return next(errorHandle(400, "Old password is incorrect"));
        }

        // Hash the new password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(newPassword, salt);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();

        // Respond with success message
        res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        next(errorHandle(403, "Token is invalid or expired"));
    }
};




/*. Ưu điểm của JWT
- Tính linh hoạt: Có thể lưu trữ thông tin người dùng mà không cần truy cập cơ sở dữ liệu mỗi lần yêu cầu.
- Độc lập: Có thể được sử dụng bởi nhiều dịch vụ khác nhau.
- Bảo mật: Payload được mã hóa, chữ ký đảm bảo không bị thay đổi.
- Hiệu năng: Xác thực nhanh vì không cần kiểm tra trong cơ sở dữ liệu.
*/
/*Hạn chế
- Không thể thu hồi: Nếu token bị đánh cắp, không có cách nào vô hiệu hóa nó 
(trừ khi sử dụng thêm danh sách "token đen").
- Payload không được mã hóa: Mặc dù chữ ký đảm bảo tính toàn vẹn, 
nội dung payload có thể bị đọc nếu không sử dụng HTTPS.
*/
/* Cách tăng cường bảo mật
- Sử dụng HTTPS: Đảm bảo token không bị lộ khi truyền qua mạng.
- Thời gian hết hạn ngắn (expiresIn): Giảm thiểu rủi ro khi token bị đánh cắp.
- Sử dụng httpOnly và sameSite cho cookie: Ngăn chặn các cuộc tấn công XSS và CSRF.
- Thêm cơ chế làm mới token (refresh token): Tạo token mới khi token cũ sắp hết hạn. */