const User = require('../models/User.model');

module.exports.signupService = async (userInfo) => {
    const user = new User(userInfo);
    const savedUser = await user.save();
    return savedUser;
};

module.exports.loginService = async (email) => {
    const user = await User.findOne({ email });
    return user;
};

module.exports.findUserByTokenService = async (token) => {
    const user = await User.findOne({ confirmationToken: token });
    return user;
};
