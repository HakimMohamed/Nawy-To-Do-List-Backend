const express = require('express');
const userController = require('../controllers/User');
const tasksController = require('../controllers/Task');
const categoryController = require('../controllers/Category');

const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after a minute."
    }
});

const router = express.Router();

// User Routes
router.get('/user', userController.getUserById);
router.post('/user/register', userController.register);
router.post('/user/complete-register', limiter, userController.completeRegistration);
router.post('/user/login', userController.login);

// User Routes
router.get('/tasks', tasksController.getTasks);
router.post('/task', tasksController.createUserTask);
router.delete('/task', tasksController.deleteUserTask);
router.patch('/task', tasksController.updateUserTask);


// Category Routes
router.get('/categories', categoryController.fetchCategories);
router.post('/category', categoryController.addCategoryToUser);
router.delete('/category', categoryController.deleteCategoryById);
router.patch('/category', categoryController.updateCategoryText);


module.exports = router;
