import multer from 'multer';
import xss from 'xss-clean';
import path from 'path';

// Image Upload and Validation Middleware
export const uploadAndValidateImage = multer({
    // Multer configuration for storage, file filter, and size limits
    limits: { fileSize: 1000000 }, // Example: Limit file size to 1MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const isAccepted = allowedTypes.test(file.mimetype) && allowedTypes.test(path.extname(file.originalname).toLowerCase());
        isAccepted ? cb(null, true) : cb(new Error('Invalid file type.'));
    },
}).single('imageFieldName'); // Adjust 'imageFieldName' based on your input field's name

// Input Sanitization Middleware
export const sanitizeInput = (req, res, next) => {
    req.body = xss(req.body);
    next();
};

// Logging Middleware for Auditing
export const logChanges = (schema) => {
    schema.pre('save', function (next) {
        console.log(`Document being saved: ${this}`);
        next();
    });
};

// Automatically Updating "Last Updated" Timestamp Middleware
export const updateTimestamp = (schema) => {
    schema.pre('save', function (next) {
        this.updatedAt = new Date();
        next();
    });
};
