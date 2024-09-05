const express = require('express');
const userController = require('../controllers/User');
const tasksController = require('../controllers/Task');
const categoryController = require('../controllers/Category');

const router = express.Router();

// User Routes
router.get('/user', userController.getUserById);
router.post('/user/register', userController.register);
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


module.exports = router;
