function errorHandler(err, req, res, next) {
    console.error(err.message.red.bold);
    res.status(500).json({ status: 'fail', error: `${err.message}` });
}

module.exports = errorHandler;
