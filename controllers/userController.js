import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const secret_key = process.env.SECRET_KEY;
const salt = 10;

// Autenticación
const auth = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({email: email});

        if(!user){
            res.status(401).json({msg: "El usuario no existe"});
        }
        
        const passValid = await bcrypt.compare(password, user.password);

        if(!passValid){
            res.status(404).json({msg: "La contraseña es inválida"});
        }

        const data = {
            id: user._id,
            email: user.email
        }

        // Se genera el token
        const jwt = jsonwebtoken.sign( data, secret_key, { expiresIn: '1h'} );

        res.status(201).json({msg: "Autenticación exitosa", token: jwt});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};

// Validaciones
const validateName = async (name, isUpdate = false) => {

    // Si estamos actualizando y el nombre no fue enviado, no validar:
    if (isUpdate && name === undefined) return;


    if (!name || typeof name !== 'string' || name.trim() === '') {
        throw new Error("ERROR: El nombre del usuario debe ser un texto y no puede quedar vacío.");
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

    const okRoles = ['persona', 'refugio', 'admin'];

    if (!role || typeof role !== 'string' || !okRoles.includes(role.toLowerCase())) {
        throw new Error("ERROR: El rol del usuario debe ser 'persona' o 'refugio' o 'admin'.");
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
    if(!user.name || !user.email || !user.password){
        return res.status(400).json({msg: "ERROR: Faltan completar parámetros."});
    }

    try {
        await validateName(user.name);
        await validateEmail(user.email);
        await validateRole(user.role);

        const passwordHash = await bcrypt.hash(user.password, salt);
        user.password = passwordHash;

        const doc = new User(user);
        await doc.save();
        res.status(201).json( {msg: "El usuario fue creado con éxito.", data: {id: doc._id, name: doc.name}} );

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

        if (user.role !== undefined) {
            await validateRole(user.role, true);
        }

        const newUser = await User.findByIdAndUpdate(id, user, {new: true});
        res.json( {msg: 'El usuario fue actualizado con éxito.', data : newUser} );

    } catch (error) {
        res.status(400).json({msg: error.message});
    }

};

export {getUsers, getUserById, addUser, deleteUser, updateUser, auth};