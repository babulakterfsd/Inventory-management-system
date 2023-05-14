/* eslint-disable no-underscore-dangle */
const { signupService, loginService } = require('../services/User.services');
const { generateToken } = require('../utils/token');

module.exports.signup = async (req, res, next) => {
    try {
        const user = await signupService(req.body);
        if (!user) {
            throw new Error('User not created');
        } else {
            res.status(201).json({
                status: 'success',
                data: user,
                message: 'Signup successful',
            });
        }
    } catch (error) {
        next(error);
    }
};

/*
 * 1. Check if Email and password are given
 * 2. Load user with email
 * 3. if not user send res
 * 4. compare password
 * 5. if password not correct send res
 * 6. check if user is active
 * 7. if not active send res
 * 8. generate token
 * 9. send user and token
 */

module.exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Please provide both email and password');
        }

        const user = await loginService(email);
        if (!user) {
            throw new Error('User not found');
        }

        if (user.status !== 'active') {
            throw new Error('User is not active yet. Please verify your email');
        }

        const isPasswordValid = user.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Password is incorrect');
        }
        const token = generateToken(user);
        const { password: userPassword, ...others } = user.toObject();

        res.status(200).json({
            status: 'success',
            data: {
                user: others,
                token,
            },
            message: 'Login successful',
        });
    } catch (error) {
        next(error);
    }
};

// ekhane ekta jinish bojhar ache je, initially website ta jkhn load hobe, tkhn to amar user nai. ami ki data diye verify korbo?? amar kache to user er kono information e nai. tkhn buddhi hocche, token je ache sei token er moddhe email ache. karon token create korar somoy payload er moddhe email ar role rekhechilam. ei jonno token ta decode korte hobe
module.exports.verifyUser = async (req, res, next) => {
    try {
        const user = await loginService(req?.user?.email);
        const { password: userPassword, ...others } = user.toObject();
        if (!user) {
            throw new Error('User not found');
        } else {
            res.status(200).json({
                status: 'success',
                data: others,
                message: 'verified',
            });
        }
    } catch (error) {
        next(error);
    }
};
