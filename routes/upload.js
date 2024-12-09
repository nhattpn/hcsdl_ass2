const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './data/products/image/'); // Lưu vào thư mục 'image'
    },
    filename: (req, file, cb) => {
        cb(null, performance.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

module.exports = {upload};