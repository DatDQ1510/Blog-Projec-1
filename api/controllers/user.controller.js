// Import model
import User from "../models/user.model.js";

// Controller logic
export const test = (req, res) => {
    res.json({ message: 'Hello world! ' });
};

// Thêm các logic khác như xử lý user ở đây nếu cần