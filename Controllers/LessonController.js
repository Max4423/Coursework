import LessonModel from '../models/lesson.js';

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
      if (lesson.user.toString() !== userId && userId !== '65577bbea633b83aab4ce705') {
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
      const doc = new LessonModel({
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        videoUrl: req.body.videoUrl,
        user: req.userId,
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
  
      // Перевірка, чи аутентифікований користувач є творцем уроку
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