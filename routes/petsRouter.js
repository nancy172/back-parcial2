import express from "express";
import {getPets, getPetById, addPet, deletePet, updatePet, filterPets, searchPetByName} from "../controllers/petController.js";

const router = express.Router();

// Rutas para mascotas
router.get('/', getPets);
router.get('/filter', filterPets);
router.get('/search', searchPetByName);
router.get('/:id', getPetById);
router.post('/', addPet);
router.delete('/:id', deletePet);
router.put('/:id', updatePet);


export default router;