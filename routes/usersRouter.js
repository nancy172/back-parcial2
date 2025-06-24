import express from "express";
import multer from "multer";
import uploadController from "../controllers/uploadController.js";
import {getUsers, getUserById, addUser, deleteUser, updateUser, auth} from "../controllers/userController.js";

import { validateToken } from "../middlewares/auth.js";

const router = express.Router();

// Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    } 
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('Tipo de archivo no permitido'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Rutas para usuarios
router.get('/', validateToken, getUsers);
router.get('/:id', validateToken, getUserById);
router.post('/', upload.single('file'), addUser);
router.post('/auth', auth);
router.delete('/:id', validateToken, deleteUser);
router.put('/:id', validateToken, upload.single('file'), updateUser);

router.post('/upload', upload.single('file'), uploadController);

export default router;