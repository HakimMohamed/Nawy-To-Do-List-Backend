const express = require('express');
const userController = require('../controllers/User');

const router = express.Router();

//User Routes
router.get('/user', userController.getUserById);
router.post('/user/register', userController.register);
router.post('/user/login', userController.login);

module.exports = router;
