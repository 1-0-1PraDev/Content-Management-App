import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true  
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    }
}, { timestamps: true });

const commentModel = mongoose.model('comment', commentSchema);
export default commentModel;