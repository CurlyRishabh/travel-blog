const multer = require('multer');
const path = require('path');

// Configure multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Get the upload type from the request
        const uploadType = req.uploadType || 'misc'; // default to misc if not specified
        
        // Define upload paths for different types
        const uploadPaths = {
            profile: 'uploads/profiles/',
            blog: 'uploads/blogs/',
            misc: 'uploads/misc/' // fallback directory
        };

        // Use the appropriate path or fallback to misc
        const uploadPath = uploadPaths[uploadType] || uploadPaths.misc;
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });
module.exports = upload;