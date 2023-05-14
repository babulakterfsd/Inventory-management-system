const jwt = require('jsonwebtoken');

module.exports.generateToken = (userInfo) => {
    const payLoad = {
        email: userInfo.email,
        role: userInfo.role,
    };
    const token = jwt.sign(payLoad, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '1d',
    });

    return token;
};
