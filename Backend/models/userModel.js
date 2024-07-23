import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        min: 8,
        required: true
    }
});

const UserModel = mongoose.model('user', userSchema);
export default UserModel;