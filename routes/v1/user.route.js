const express = require('express');
const UserController = require('../../controllers/User.controller');
const { verifyToken } = require('../../middlewares/verifyToken');

const router = express.Router();

router.route('/signup').post(UserController.signup);
router.route('/login').post(UserController.login);
router.route('/verify').get(verifyToken, UserController.verifyUser);

module.exports = router;
