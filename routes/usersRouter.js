import express from "express";
import {getUsers, getUserById, addUser, deleteUser, updateUser, auth} from "../controllers/userController.js";
import { validateToken } from "../middlewares/auth.js";

const router = express.Router();

// Rutas para usuarios
router.get('/', getUsers);
router.get('/:id', validateToken, getUserById);
router.post('/', addUser);
router.post('/auth', auth);
router.delete('/:id', validateToken, deleteUser);
router.put('/:id', validateToken, updateUser);

export default router;