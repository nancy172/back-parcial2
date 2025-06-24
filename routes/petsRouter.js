import express from "express";
import upload from "../middlewares/upload.js";
import { validateToken } from "../middlewares/auth.js";
import { isCaretaker } from "../middlewares/roles.js";
import {getPets, getPetById, addPet, deletePet, updatePet, filterPets, searchPetByName} from "../controllers/petController.js";

const router = express.Router();

// Rutas para mascotas
router.get('/', getPets);
router.get('/filter', filterPets);
router.get('/search', searchPetByName);
router.get('/:id', getPetById);

// Protegidas
router.post('/', validateToken, isCaretaker, upload.array('files', 5), addPet);
router.delete('/:id', validateToken, isCaretaker, deletePet);
router.put('/:id', validateToken, isCaretaker, upload.array('files', 5), updatePet);


export default router;