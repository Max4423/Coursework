import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.js';
import nodemailer from 'nodemailer';



export const register = async (req, res) => {
    

    try{ 
    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    
    const doc = new UserModel({
    email:req.body.email,
    fullName:req.body.fullName,
    workExperience:req.body.workExperience,
    avatarUrl:req.body.avatarUrl,
    passwordHash: hash,
    });
    
    const user = await doc.save();
    
    const token = jwt.sign({
        _id: user._id,
    }, 'secret123',
    {
        expiresIn:'30d',
    }
    );
    
    const{passwordHash, ...userData} = user._doc;
    
    res.json({
        ... userData,
        token,
    });
    
const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'medcourses.notifications@gmail.com', 
                pass: 'umghhciqhpbrytgt' 
            }
        });

        const mailOptions = {
            from: '<medcourses.notifications@gmail.com>',
            to: req.body.email, 
            subject: 'Успішна реєстрація',
            text: 'Вітаю, ' + req.body.fullName + '. Ви успішно зареєструвалися на сайті медкурсів. Приємного користування сервісом!'
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });


    } catch(err){
    console.log(err);
    res.status(500).json({
    message: 'Неуспішна реєстрація',
    });
    }
    
    
    };
export const login = async (req, res) => {
    try{
        const user = await UserModel.findOne({email: req.body.email});

        if (!user){
            return res.status(404).json({
            message: 'Користувач не знайдений',
            });
        }

    const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

    if(!isValidPass){
        return res.status(404).json({
            message: 'Неправильний пароль',
    });
}
const token = jwt.sign({
    _id: user._id,
}, 'secret123',
{
    expiresIn:'30d',
}
);

const{passwordHash, ...userData} = user._doc;

res.json({
    ... userData, 
    token,
});

} catch(err){
    console.log(err);
res.status(500).json({
message: 'Неуспішний вхід',
});    
}
};

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Користувач не знайдений',
            });
        }
        const { passwordHash, ...userData } = user._doc;

        res.json(userData); 

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Немає доступу',
        });
    }
};

export const getAllUsers = async (req, res) => {
    try {
      const users = await UserModel.find();
      res.json(users);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не вдалося отримати користувачів',
      });
    }
  };