import Person from "../models/PersonModel.js";
import mongoose from "mongoose";

// Validaciones
const validatePerson = (data, isUpdate = false) => {

    const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const phoneRegex = /^\+?\d{7,15}$/;

    if (!isUpdate && !data.userId) {
        throw new Error("El campo userId es obligatorio.");
    }

    if (!isUpdate || data.firstName !== undefined) {
        if ( typeof data.firstName !== 'string' || data.firstName.trim() === '' || !nameRegex.test(data.firstName) ) {
            throw new Error("El nombre solo puede contener letras y no puede estar vacío.");
        }
    }

    if (!isUpdate || data.lastName !== undefined) {
        if ( typeof data.lastName !== 'string' || data.lastName.trim() === '' || !nameRegex.test(data.lastName) ) {
            throw new Error("El apellido solo puede contener letras y no puede estar vacío.");
        }
    }

    if (!isUpdate || data.phone !== undefined) {
        if ( typeof data.phone !== 'string' || data.phone.trim() === '' || !phoneRegex.test(data.phone) ) {
            throw new Error("El teléfono debe tener entre 7 y 15 dígitos y puede comenzar con '+'.");
        }
    }

    if (!isUpdate || data.address !== undefined) {
        if ( typeof data.address !== 'string' || data.address.trim() === '' ) {
            throw new Error("La dirección es obligatoria.");
        }
    }

    // Booleans
    const validateBoolean = (value, fieldName) => {
        if (value === undefined) {
            throw new Error(`El campo ${fieldName} es obligatorio.`);
        }
        if (typeof value !== 'boolean') {
            throw new Error(`${fieldName} debe ser booleano.`);
        }
    };

    if (!isUpdate) {
        validateBoolean(data.canAdopt, 'canAdopt');
        validateBoolean(data.canGiveForAdoption, 'canGiveForAdoption');
    } else {
        if (data.canAdopt !== undefined) {
            validateBoolean(data.canAdopt, 'canAdopt');
        }
        if (data.canGiveForAdoption !== undefined) {
            validateBoolean(data.canGiveForAdoption, 'canGiveForAdoption');
        }
    }
    
};

// Controladores
const getPersons = async (req, res) => {
    try {
        const persons = await Person.find().populate('userId', 'email username role');
        res.status(200).json(persons);
    } catch (error) {
        res.status(500).json({ msg: "ERROR: No se pudo obtener la lista de personas." });
    }
};

const getPersonById = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ERROR: ID de usuario inválido." });
    }

    try {
        const person = await Person.findById(id).populate('userId', 'email username role');
        if (!person) {
            return res.status(404).json({ msg: "ERROR: No se encontró la persona." });
        }
        res.status(200).json(person);

    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor. No se pudo obtener la persona." });
    }
};

const addPerson = async (req, res) => {
    const person = req.body;

    // Se verifica los parámetros completos
    if (!person.userId || !person.firstName || !person.lastName || !person.phone || !person.address || person.canAdopt === undefined || person.canGiveForAdoption === undefined) {
        return res.status(400).json({ msg: "ERROR: Faltan completar parámetros." });
    }

    try {
        validatePerson(person);

        const doc = new Person(person);
        await doc.save();

        res.status(201).json({
            msg: "La persona fue creada con éxito.",
            data: {
                id: doc._id,
                firstName: doc.firstName,
                lastName: doc.lastName,
                userId: doc.userId,
            },
        });

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const updatePerson = async (req, res) => {
    const id = req.params.id;
    const person = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ERROR: ID de usuario inválido." });
    }

    try {
        // Primero se verifica si existe
        const personExists = await Person.findById(id);
        if(!personExists) {
            return res.status(404).json({msg: 'ERROR: La persona que desea editar no existe.'});
        }

        validatePerson(person, true);

        const newPerson = await Person.findByIdAndUpdate(id, person, { new: true });
        res.status(200).json({ msg: "La persona fue actualizada con éxito.", data: newPerson });

    } catch (error) {
        res.status(400).json({ msg: error.message });
    }
};

const deletePerson = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ msg: "ERROR: ID de usuario inválido." });
    }

    try {
        const status = await Person.findByIdAndDelete(id);
        if (status) {
            res.json( {msg: 'La persona fue eliminada con éxito.'} );
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró la persona.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo eliminar la persona.'});
    }
};

export { getPersons, getPersonById, addPerson, updatePerson, deletePerson };
