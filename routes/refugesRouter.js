import express from "express";
import { validateToken } from "../middlewares/auth.js";
import {getRefuges, getRefugeById, addRefuge, updateRefuge, deleteRefuge} from "../controllers/refugeController.js";

const router = express.Router();

router.get("/", getRefuges);
router.get("/:id", getRefugeById);
router.post("/", addRefuge);
router.put("/:id", validateToken, updateRefuge);
router.delete("/:id", validateToken, deleteRefuge);

export default router;