const path = require('path');
const fs = require('fs');

module.exports.getHomePage = async (req, res, next) => {
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

module.exports.uploadFile = async (req, res, next) => {
    try {
        res.status(200).json({
            message: 'File uploaded successfully',
            // file: req.files,  for multiple file upload
            file: req.file,
        });
    } catch (error) {
        next(error);
    }
};

module.exports.getSingleFile = async (req, res, next) => {
    try {
        const file = path.join(
            __dirname,
            '../storage/images/1683979748020_103245821_funny developer.gif'
        );
        const readStream = fs.createReadStream(file);
        readStream.pipe(res);
    } catch (error) {
        next(error);
    }
};
