const jwt = require('jsonwebtoken');
const { promisify } = require('util');
/**
 * 1. check if token exists
 * 2. if not token send res
 * 3. decode the token
 * 4. if valid next
 */

// jekono route e user  verify korte amra ei middleware ta use korbo, jodi token thake, taile req er sathe user ke pathiye diye next() call kre dibo, ar jodi token  na thake, tahole not logged in error message ta pathiye dibo. process ta hocche, user jkhn login korbe, tkhn amra server theke ekta token pathiye dibo ar client side e sei token ke local storage ba session storage kothao save rakhbo. then je je route gula amar secure, sei route gulate hit korar aage amra ei middleware ta boshiye dibo. ar oi secure route gulate hit korar somoy obosshoi oi local ba session storage theke token ta niye header er sathe server e pathiye dibo. tarpor server token ke verify kore decission nibe.

module.exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.split(' ')?.[1];

        if (!token) {
            return res.status(401).json({
                status: 'fail',
                error: 'You are not logged in',
            });
        }

        // jwt.verify is async function, so we need to promisify it. after promisify it will return a promise. so, we took promisify from node core module util and then it with token and process.env.TOKEN_SECRET
        const decoded = await promisify(jwt.verify)(token, process.env.ACCESS_TOKEN_SECRET);

        // const user = User.findOne({ email: decoded.email }) ; if we need full info of the user

        req.user = decoded;

        next();
    } catch (error) {
        res.status(403).json({
            status: 'fail',
            error: 'Invalid token',
        });
    }
};
