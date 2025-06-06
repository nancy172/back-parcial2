import User from "../models/UserModel.js";

// Validaciones
const validateName = async (name, isUpdate = false) => {

    // Si estamos actualizando y el nombre no fue enviado, no validar:
    if (isUpdate && name === undefined) return;


    if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error("ERROR: El nombre del usuario debe ser un texto y no puede quedar vacío.");
    }
};

const validatePhone = async (phone, isUpdate = false) => {

    if (isUpdate && phone === undefined) return;

    if (typeof phone !== 'number') {
        throw new Error('ERROR: El número de teléfono debe ser un número.');
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
        throw new Error('ERROR: El número de teléfono es inválido. Debe tener 10 dígitos.');
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
        throw new Error('ERROR: El número de teléfono ya está registrado.');
    }
};

const validateEmail = async (email, userId = null, isUpdate = false) => { 

    if (isUpdate && email === undefined) return;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new Error('ERROR: El formato del email es inválido.');
    }

    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== userId) {
        throw new Error('ERROR: El email ya está registrado en otro usuario.');
    }
};

const validateRole = async (role, isUpdate = false) => {

    if (isUpdate && role === undefined) return;

    const okRoles = ['cuidador', 'adoptante'];

    if (!role || typeof role !== 'string' || !okRoles.includes(role.toLowerCase())) {
        throw new Error("ERROR: El rol del usuario debe ser 'cuidador' o 'adoptante'.");
    }
    
};

// Controladores
const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({msg: 'ERROR: No se pudo obtener la lista de usuarios.'});
    }
    
};

const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id);
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró el usuario.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo obtener el usuario.'});
    }
    
};

const addUser = async (req, res) => {
    const user = req.body;

    // Se verifica los parámetros completos
    if(!user.name || !user.email ||!user.phone){
        return res.status(400).json({msg: "ERROR: Faltan completar parámetros."});
    }

    try {
        await validateName(user.name);
        await validateEmail(user.email);
        await validatePhone(user.phone);
        await validateRole(user.role);

        const doc = new User(user);
        await doc.save();
        res.status(201).json( {msg: "El usuario fue creado con éxito.", data: {id: doc._id, name: doc.name, email: doc.email, phone: doc.phone}} );

    } catch (error) {
        res.status(400).json({msg: error.message});
    }
    
};

const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        const status = await User.findByIdAndDelete(id);
        if (status) {
            res.json( {msg: 'El usuario fue eliminado con éxito.'} );
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró el usuario.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo eliminar el usuario.'});
    }
    
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const user = req.body;

    try {
        // Primero se verifica si existe
        const userExist = await User.findById(id);
        if(!userExist) {
            return res.status(404).json({msg: 'ERROR: El usuario que desea editar no existe.'});
        }

        if (user.name !== undefined) {
            await validateName(user.name, true);
        }

        if (user.email !== undefined) {
            await validateEmail(user.email, id, true);
        }

        if (user.phone !== undefined) {
            await validatePhone(user.phone, true);
        }

        if (user.role !== undefined) {
            await validateRole(user.role, true);
        }

        const newUser = await User.findByIdAndUpdate(id, user, {new: true});
        res.json( {msg: 'El usuario fue actualizado con éxito.', data : newUser} );

    } catch (error) {
        res.status(400).json({msg: error.message});
    }

};

export {getUsers, getUserById, addUser, deleteUser, updateUser};