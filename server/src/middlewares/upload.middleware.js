import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';
import { env } from '../config/env.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, env.UPLOAD_DIR || 'src/uploads'),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const ALLOWED_TYPES = /pdf|jpeg|jpg|png|xlsx|docx/;

export const upload = multer({
  storage,
  limits: { fileSize: env.MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    ALLOWED_TYPES.test(ext) ? cb(null, true) : cb(new AppError('File type not allowed', 400, 'INVALID_FILE'));
  },
});
