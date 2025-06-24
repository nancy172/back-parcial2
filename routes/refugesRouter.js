import express from "express";
import {getRefuges, getRefugeBRefuge, updateRefuge, deleteRefuge} from "../controllers/refugeController.js";

const router = express.Router();

router.get("/", getRefuges);
router.get("/:id", getRefugeById);
router.post("/", addRefuge);
router.put("/:id", updateRefuge);
router.delete("/:id", deleteRefuge);

export default router;