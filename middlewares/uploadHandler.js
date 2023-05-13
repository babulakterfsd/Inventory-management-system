const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'storage/images/');
    },
    filename(req, file, cb) {
        // preserve the original file name
        cb(null, `${Date.now()}_${Math.ceil(Math.random() * 1e9)}_${file.originalname}`); // seshe filename, ar unique korar jonno prothome date.now ar math.random use kora hoyeche
    },
});

const uploader = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const supportedImageTypes = /jpeg|jpg|png|gif/;
        const extension = path.extname(file.originalname).toLowerCase();

        if (supportedImageTypes.test(extension)) {
            cb(null, true);
        } else {
            cb(new Error('Only jpeg/jpg/png or gif images are allowed'));
        }
    },
    limits: {
        fileSize: 2000000, // 2MB
    },
});

module.exports = uploader;
