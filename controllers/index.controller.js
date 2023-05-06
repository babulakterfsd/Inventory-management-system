module.exports.handleHomeRoute = async (req, res, next) => {
    try {
        res.render('home.ejs', {
            five: 5,
            three: 3,
            user: {
                name: 'Awal',
                age: 29,
            },
        });
    } catch (error) {
        next(error); // This will be caught by the error handler middleware, this process is followed in production level code
    }
};
