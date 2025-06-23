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

const upload = multer({ storage:storage });

// Rutas para usuarios
router.get('/', getUsers);
router.get('/:id', validateToken, getUserById);
router.post('/', addUser);
router.post('/auth', auth);
router.delete('/:id', validateToken, deleteUser);
router.put('/:id', upload.single('foto'), updateUser);

router.post('/upload', upload.single('foto'), uploadController);

export default router;