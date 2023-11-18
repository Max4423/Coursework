import {body} from 'express-validator'

export const loginValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль має бути більшим за 5 символів').isLength({ min: 5}),
];

export const registerValidation = [
    body('email', 'Неправильний формат пошти').isEmail(),
    body('password', 'Пароль має бути більшим за 5 символів').isLength({ min: 5}),
    body('fullName', 'Неправильний формат імені').isLength({ min: 2}),
    body('workExperience', 'Неправильний формат досвіду роботи').optional().isString(),
    body('avatarUrl', 'Неправильний формат посилання').optional().isURL(),
];

export const lessonCreateValidation = [
    body('title', 'Неправильний формат заголовка').isLength({ min: 3}).isString(),
    body('text', 'Введіть текст уроку').isLength({ min: 3}).isString(),
    body('imageUrl', 'Неправильний формат посилання').optional().isString(),
    body('videoUrl', 'Неправильний формат посилання').optional().isURL(),
];