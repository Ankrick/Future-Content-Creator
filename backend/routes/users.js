const express = require('express');
const UserController = require('../controllers/UserController')
const { body } = require('express-validator');
const router = express.Router();
const handleErrorMessages = require('../middlewares/handleErrorMessages');
const Users = require('../models/Users');
const AuthMiddleware = require('../middlewares/AuthMiddleware');


router.get('/me', AuthMiddleware, UserController.me)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)

router.post('/register', [
    body('name').notEmpty(), 
    body('email').custom(async value => {
        const user = await Users.findOne({email : value});
        if (user) {
          throw new Error('E-mail already in use');
        }
    }),
    body('password').notEmpty()
], handleErrorMessages, UserController.register)

module.exports = router