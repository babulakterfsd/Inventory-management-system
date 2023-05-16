/* eslint-disable no-underscore-dangle */
const bcrypt = require('bcryptjs');
const {
    signupService,
    loginService,
    findUserByTokenService,
} = require('../services/User.services');
const { sendMailWithGmail } = require('../utils/sendEmail');
const { generateToken } = require('../utils/token');

module.exports.signup = async (req, res, next) => {
    try {
        const user = await signupService(req.body);

        const token = user.generateConfirmationToken();

        await user.save({ validateBeforeSave: false }); // save korar karon hocche, prothom line e to user create hoyei gelo. kintu db te confirmation token ta rakhtesi ami generateConfirmationToken method er maddhome.tai db te jaate confirmationtoken ar setar expire date save hoy, shei jonno user.save() call kora lagche abar

        const mailData = {
            to: [user.email],
            subject: 'Verify your Account',
            text: `Thank you for creating your account. Please confirm your account here: ${
                req.protocol
            }://${req.get('host')}${req.originalUrl}/confirmation/${token}`,
        };

        await sendMailWithGmail(mailData);

        if (!user) {
            throw new Error('Signup failed');
        } else {
            res.status(201).json({
                status: 'success',
                data: user,
                message: 'Signup successful. Please verify your email to activate your account',
            });
        }
    } catch (error) {
        next(error);
    }
};

module.exports.confirmEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        const user = await findUserByTokenService(token);

        if (!user) {
            return res.status(403).json({
                status: 'fail',
                error: 'Invalid token',
            });
        }

        const expired = new Date() > new Date(user.confirmationTokenExpires);

        if (expired) {
            return res.status(401).json({
                status: 'fail',
                error: 'Token expired',
            });
        }

        user.status = 'active';
        user.confirmationToken = undefined;
        user.confirmationTokenExpires = undefined;

        user.save({ validateBeforeSave: false }); // after editing user, we need to save it

        res.status(200).json({
            status: 'success',
            message: 'Successfully activated your account.',
        });
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
