function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Internal Server Error, caught by error handler');
}

module.exports = errorHandler;
