import express from "express";
import { validateToken } from "../middlewares/auth.js";
import {getPersons, getPersonById, addPerson, updatePerson, deletePerson} from "../controllers/personController.js";

const router = express.Router();

router.get("/", getPersons);
router.get("/:id", getPersonById);
router.post("/", validateToken, addPerson);
router.put("/:id", validateToken, updatePerson);
router.delete("/:id", validateToken, deletePerson);

export default router;
