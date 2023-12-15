import mongoose from 'mongoose';

const LessonSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    text:{
        type: String,
        required: true,  
        unique: true,
    },
    videoUrl:{
        type: String,
    },
    photoUrl:{
        type: String,
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

},
{
    timestamps: true,
},
);

export default mongoose.model('Lesson', LessonSchema);