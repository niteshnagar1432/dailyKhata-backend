const multer = require('multer');
const express = require('express');
const { verifyToken } = require('../controllers/indexController');
const { createChat, deleteChat, viewChat } = require('../controllers/chatController');

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

route.post('/create', verifyToken, upload.single('file'), createChat);
route.get('/delete/:chatId',verifyToken,deleteChat);
route.get('/view/:chatId',verifyToken,viewChat);

module.exports = route;
