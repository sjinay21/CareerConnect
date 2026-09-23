import multer from "multer";
import os from "os";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, os.tmpdir());
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});

const uploadMiddleware = multer({ storage: storage });

export default uploadMiddleware;
