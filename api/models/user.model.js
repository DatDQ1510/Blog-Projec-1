import mongoose from "mongoose";

const userSchema = mongoose.Schema(
    {
        usename: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true
    }
);
const User = mongoose.model('User', userSchema);
app.get('/', (req, res) => {
    res.json({ message: 'Hello world !123' })

})
export default User;

