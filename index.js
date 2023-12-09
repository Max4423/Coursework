import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import {registerValidation, loginValidation, lessonCreateValidation} from './validations.js';
import * as UserController from './Controllers/UserController.js';
import * as LessonController from './Controllers/LessonController.js';
import checkAuth from './utils/checkAuth.js';
import multer from 'multer';
import handleValidationErrors from './utils/handleValidationErrors.js';
mongoose
    .connect(
    'mongodb+srv://miksimmiks:wqNIvgdk4tYkP5wm@cluster0.018qrom.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB error', err));
    
const app = express();
const storage =  multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads'); 
    },
    filename:(_, file, cb) =>{
        cb(null, file.originalname);
    },
});

var urlencodedParser = bodyParser.urlencoded({extended: false});

const upload = multer({storage});

app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(bodyParser.raw({ type: 'text/plain' }));// body parser



app.post('/auth/login', urlencodedParser,loginValidation, handleValidationErrors, UserController.login );

app.post('/auth/register', urlencodedParser, registerValidation, handleValidationErrors, UserController.register );

app.get('/auth/me',checkAuth, UserController.getMe);

app.get('/users', UserController.getAllUsers);

app.post('/upload',checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`,
    });
});
 

app.get('/lessons',LessonController.getAll);
app.get('/lessons/:id', LessonController.getOne);
app.post('/lessons',checkAuth, lessonCreateValidation, handleValidationErrors, LessonController.create);
app.delete('/lessons/:id',checkAuth, LessonController.remove);
app.patch('/lessons/:id',checkAuth, lessonCreateValidation, handleValidationErrors, LessonController.update);


app.listen(4444, (err) => {
    if(err) {
        return console.log(err);
    }
    console.log('Server OK');
}); 