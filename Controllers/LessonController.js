import LessonModel from '../models/lesson.js';
import UserModel from '../models/user.js';

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

      res.json(lesson);
  } catch (err) {
      console.log(err);
      res.status(500).json({
          message: 'Не вдалось створити урок',
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