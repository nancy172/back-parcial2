import Refuge from "../models/RefugeModel.js";
import mongoose from "mongoose";

// Validaciones
const validateRefuge = (data, isUpdate = false) => {
    const phoneRegex = /^\+?\d{7,15}$/;

    if (!isUpdate && !data.userId) {
        throw new Error("El campo userId es obligatorio.");
    }

    if (!isUpdate || data.name !== undefined) {
        if (typeof data.name !== "string" || data.name.trim() === "") {
            throw new Error("El nombre es obligatorio y debe ser texto.");
        }
    }

    if (!isUpdate || data.phone !== undefined) {
        if (
            typeof data.phone !== "string" ||
            data.phone.trim() === "" ||
            !phoneRegex.test(data.phone)
        ) {
            throw new Error("El teléfono debe tener entre 7 y 15 dígitos y puede comenzar con '+'.");
        }
    }

    if (!isUpdate || data.address !== undefined) {
        if (typeof data.address !== "string" || data.address.trim() === "") {
            throw new Error("La dirección es obligatoria.");
        }
    }
};

// Controladores
const getRefuges = async (req, res) => {
    try {
        const refuges = await Refuge.find().populate("userId", "email username role");
        res.status(200).json(refuges);
    } catch (error) {
        res.status(500).json({ msg: "ERROR: No se pudo obtener la lista de refugios." });
    }
};

const getRefugeById = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ERROR: ID de refugio inválido." });
    }

    try {
        const refuge = await Refuge.findById(id).populate("userId", "email username role");
        if (!refuge) {
            return res.status(404).json({ msg: "ERROR: No se encontró el refugio." });
        }
        res.status(200).json(refuge);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor. No se pudo obtener el refugio." });
    }
};

const addRefuge = async (req, res) => {
    const refuge = req.body;

    // Verificar parámetros completos
    if (!refuge.userId || !refuge.name || !refuge.phone || !refuge.address) {
        return res.status(400).json({ msg: "ERROR: Faltan completar parámetros." });
    }

    try {
        validateRefuge(refuge);

        const doc = new Refuge(refuge);
        await doc.save();

        res.status(201).json({
            msg: "El refugio fue creado con éxito.",
            data: {
                id: doc._id,
                name: doc.name,
                userId: doc.userId,
            },
        });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const updateRefuge = async (req, res) => {
    const id = req.params.id;
    const refuge = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ERROR: ID de refugio inválido." });
    }

    try {
        // Verificar existencia
        const refugeExists = await Refuge.findById(id);
        if (!refugeExists) {
            return res.status(404).json({ msg: "ERROR: El refugio que desea editar no existe." });
        }

        validateRefuge(refuge, true);

        const newRefuge = await Refuge.findByIdAndUpdate(id, refuge, { new: true });
        res.status(200).json({ msg: "El refugio fue actualizado con éxito.", data: newRefuge });
    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const deleteRefuge = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ERROR: ID de refugio inválido." });
    }

    try {
        const status = await Refuge.findByIdAndDelete(id);
        if (status) {
            res.json({ msg: "El refugio fue eliminado con éxito." });
        } else {
            res.status(404).json({ msg: "ERROR: No se encontró el refugio." });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor. No se pudo eliminar el refugio." });
    }
};

export { getRefuges, getRefugeById, addRefuge, updateRefuge, deleteRefuge };
