import express from "express";
import { validateToken } from "../middlewares/auth.js";
import {getPersons, getPersonById, addPerson, updatePerson, deletePerson} from "../controllers/personController.js";

const router = express.Router();

router.get("/", validateToken, getPersons);
router.get("/:id", validateToken, getPersonById);
router.post("/", addPerson);
router.put("/:id", validateToken, updatePerson);
router.delete("/:id", validateToken, deletePerson);

export default router;
