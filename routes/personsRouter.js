import express from "express";
import {getPersons, getPersonById, addPerson, updatePerson, deletePerson} from "../controllers/personController.js";

const router = express.Router();

router.get("/", getPersons);
router.get("/:id", getPersonById);
router.post("/", addPerson);
router.put("/:id", updatePerson);
router.delete("/:id", deletePerson);

export default router;
