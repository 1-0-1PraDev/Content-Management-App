import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String
    },
    summary: {
        type: String
    }, 
    content: {
        type: String
    },
    cover: {
        type: String
    },
    category: {
        type: String
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        }
    ],
    isLiked: { type: Boolean, default: false },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment'
        }
    ]
}, {timestamps: true});

const postModel = mongoose.model('post', postSchema);
export default postModel;
