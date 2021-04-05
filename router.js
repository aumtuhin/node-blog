const express = require('express');
const router = express.Router();
const userController = require('./controllers/userController');
const postController = require('./controllers/postController');

// user routes
router.get('/', userController.home);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// profile related ropte
router.get('/profile/:username', userController.ifUserExits, userController.profilePostsScreen);

//post related routes
router.get('/create-post', userController.mustBeLoogedIn, postController.viewCreateScreen);
router.post('/create-post', userController.mustBeLoogedIn, postController.create);
router.get('/post/:id', postController.viewSingle);



module.exports = router;