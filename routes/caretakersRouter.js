import express from "express";
import {getCaretakers, getCaretakerById, addCaretaker, deleteCaretaker, updateCaretaker, filterCaretakers, searchCaretakerByName} from "../controllers/caretakerController.js";

const router = express.Router();

// Rutas para responsables/cuidadores
router.get('/', getCaretakers);
router.get('/search', searchCaretakerByName);
router.get('/filter', filterCaretakers);
router.get('/:id', getCaretakerById);
router.post('/', addCaretaker);
router.delete('/:id', deleteCaretaker);
router.put('/:id', updateCaretaker);


export default router;