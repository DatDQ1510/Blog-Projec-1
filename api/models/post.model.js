import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
{
    userId: { type: String,  required: true, },
    content: {type: String,  required: true, },
    title: {type: String, required: true,unique: true, },
    image: { type: String, default: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Real_Madrid_CF.svg/800px-Real_Madrid_CF.svg.png ' },
    category: { type: String, default: 'Uncategorized',},
    slug: {type: String,required: true,unique: true,},
},
{      
    timestamps: true 
});   
const Post = mongoose.model('Post', postSchema);
export default Post;