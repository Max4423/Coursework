import LessonModel from '../models/lesson.js';
import UserModel from '../models/user.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
export const getAll = async (req, res) => {
try{
    const lessons = await LessonModel.find().populate('user').exec();

    res.json(lessons);
} catch(err){
    console.log(err);
    res.status(500).json({
    message: 'Не вдалось получити уроки',
    });
}
};


export const getOne = async (req, res) => {
    try {
      const lessonId = req.params.id;
  
      const lesson = await LessonModel.findById(lessonId);
  
      if (!lesson) {
        return res.status(404).json({
          message: 'Урок не знайдений',
        });
      }
  
      res.json(lesson);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не вдалось отримати урок',
      });
    }
  };


  export const create = async (req, res) => {
    try {
      const userId = req.userId;
      const user = await UserModel.findById(userId);
      const userRole = user ? user.role : null;
  
      if (userRole !== 'teacher') {
        return res.status(403).json({
          message: 'Ви не маєте дозволу на створення уроку',
        });
      }
  
      const doc = new LessonModel({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        videoUrl: req.body.videoUrl,
        photoUrl: req.body.photoUrl,
        user: userId,
      });
  
      const lesson = await doc.save();
      user.lessons.push(lesson._id);
      await user.save();
  
      res.json(lesson);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не вдалось створити урок',
      });
    }
  }; 

  export const remove = async (req, res) => {
    try {
      const lessonId = req.params.id;
      const userId = req.userId; 
  
      const lesson = await LessonModel.findById(lessonId);
  
      if (!lesson) {
        return res.status(404).json({
          message: 'Урок не знайдено',
        });
      }
  
      // Перевірка, чи аутентифікований користувач є творцем уроку
      if (lesson.user.toString() !== userId) {
        return res.status(403).json({
          message: 'Ви не маєте дозволу на видалення цього уроку',
        });
      }
  
      const result = await LessonModel.findOneAndDelete({ _id: lessonId });
  
      if (!result) {
        return res.status(404).json({
          message: 'Урок не знайдено',
        });
      }
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не вдалося видалити урок',
      });
    }
  };


  export const update = async (req, res) => {
    try {
      const lessonId = req.params.id;
      const userId = req.userId; 
  
      const lesson = await LessonModel.findById(lessonId);
  
      if (!lesson) {
        return res.status(404).json({
          message: 'Урок не знайдено',
        });
      }
  
    
      if (lesson.user.toString() !== userId) {
        return res.status(403).json({
          message: 'Ви не маєте дозволу на оновлення цього уроку',
        });
      }
  
      await LessonModel.updateOne(
        {
          _id: lessonId,
        },
        {
          title: req.body.title,
          text: req.body.text,
          imageUrl: req.body.imageUrl,
          videoUrl: req.body.videoUrl,
          photoUrl: req.body.photoUrl,
          user: userId, 
        },
      );
  
      res.json({
        success: true,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не вдалося оновити урок',
      });
    }
  };


  
export const registerForLesson = async (req, res) => {
  try {
      const lessonId = req.body.lessonId;
      const userId = req.userId;

      const user = await UserModel.findById(userId);
      const lesson = await LessonModel.findById(lessonId); 

      if (!lesson) {
          return res.status(404).json({
              message: 'Урок не знайдено',
          });
      }

      if (user.lessons.includes(lessonId)) {
          return res.status(400).json({
              message: 'Ви вже зареєстровані на цей урок',
          });
      }

      user.lessons.push(lessonId);
      await user.save();

      sendRegistrationEmail(user.email, user.fullName, lessonId, lesson.title);

      res.json({
          success: true,
      });
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не вдалося зареєструватися на урок',
      });
  }
};


const sendRegistrationEmail = (toEmail, fullName, lessonId, lessonTitle) => {
  const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
          user: 'medcourses.message@gmail.com',
          pass: 'ditgplqtpmaamqik',
      }
  });

  const mailOptions = {
      from: '<medcourses.message@gmail.com>',
      to: toEmail,
      subject: 'Registration for a Lesson',
      text: `Вітаю, ${fullName},\n\n Ви успішно зареєструвались на курс "${lessonTitle}" (ID: ${lessonId}).\n\Приємного навчання!`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log(error);
      } else {
          console.log('Email sent: ' + info.response);
      }
  });
};

  export const getUserLessons = async (req, res) => {
    try {
      const userId = req.userId;
  
      const user = await UserModel.findById(userId).populate('lessons');
  
      if (!user) {
        return res.status(404).json({
          message: 'Користувач не знайдений',
        });
      }
  
      const lessons = user.lessons;
  
      const lessonTitles = lessons.map(lesson => lesson.title);
  
      res.json(lessonTitles);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: 'Не вдалося отримати уроки користувача',
      });
    }
  };