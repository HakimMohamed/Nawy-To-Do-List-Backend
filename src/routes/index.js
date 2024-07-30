const express = require('express');
const userController = require('../controllers/User');

const router = express.Router();

//User Routes
router.get('/user', userController.getUserById);
router.post('/user/register', userController.registerUser);
router.get('/user', userController.getUserById);


module.exports = router;
