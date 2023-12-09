import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,  
        unique: true,
    },
    workExperience:{
        type: String,
    },

    selfieUrl:{
        type: String,
    },

    role: {
        type: String,
        enum: ['student', 'teacher'],
        default: 'student',
        required: true, 
    },

    passwordHash: {
        type: String,
        required: true,  
    },
    avatarUrl: String,
},
{
    timestamps: true,
},
);

export default mongoose.model('User', UserSchema);