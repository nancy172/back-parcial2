import express from "express";
import upload from "../middlewares/upload.js";
// import uploadController from "../controllers/uploadController.js";
import {getUsers, getUserById, addUser, deleteUser, updateUser, login} from "../controllers/userController.js";

import { validateToken } from "../middlewares/auth.js";

const router = express.Router();

// Rutas para usuarios
router.get('/', validateToken, getUsers);
router.get('/:id', validateToken, getUserById); 
router.post('/', upload.single('file'), addUser);
router.post('/login', login);
router.delete('/:id', validateToken, deleteUser);
router.put('/:id', validateToken, upload.single('file'), updateUser);

// router.post('/upload', validateToken, upload.single('file'), uploadController);

export default router;