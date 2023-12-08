const express = require('express');
const multer = require('multer');
const { index, mobVerify, SignIn, SignUp, Home, verifyToken, EditProfile, UploadProfile } = require('../controllers/indexController');
const route = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = file.originalname.split('.').pop();
        const filename = 'file-' + uniqueSuffix + '.' + ext;
        cb(null, filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG or PNG files are allowed.'), false);
    }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

route.get('/',index);
route.get('/sms',mobVerify)
route.post('/auth/user/sign-in',SignIn);
route.post('/auth/user/sign-up',SignUp);

route.post('/auth/user/edit',verifyToken,EditProfile);
route.post('/user/profile/upload',verifyToken,upload.single('file'),UploadProfile);

route.post('/home',verifyToken,Home);

module.exports = route;