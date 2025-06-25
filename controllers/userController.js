import User from "../models/UserModel.js";
import { deleteFile } from '../utils/fileUtils.js';
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const secret_key = process.env.SECRET_KEY;
const salt = 10;

// Autenticación
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({msg: "Email y contraseña son obligatorios"});
        }

        const user = await User.findOne({email: email});

        if(!user){
            return res.status(401).json({msg: "El usuario no existe"});
        }
        
        const passValid = await bcrypt.compare(password, user.password);

        if(!passValid){
            return res.status(401).json({msg: "La contraseña es inválida"});
        }

        const data = {
            id: user._id,
            email: user.email
        }

        // Se genera el token
        const jwt = jsonwebtoken.sign( data, secret_key, { expiresIn: '1h'} );

        res.status(200).json({msg: "Autenticación exitosa", token: jwt});

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    
};

// Validaciones
const validateUsername = async (username, userId = null, isUpdate = false) => {

    // Si estamos actualizando y el nombre no fue enviado, no validar:
    if (isUpdate && username === undefined) return;

    if (!username || typeof username !== 'string' || username.trim() === '') {
        throw new Error("ERROR: El nombre de usuario debe ser un texto y no puede quedar vacío.");
    }

    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        throw new Error("ERROR: El nombre de usuario solo puede contener letras, números y guiones bajos (_). No se permiten espacios.");
    }

    const usernameExists = await User.findOne({ username: username });
    if (usernameExists && usernameExists._id.toString() !== userId) {
        throw new Error('ERROR: El nombre de usuario ya está en uso.');
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

const validatePassword = (password, isUpdate = false) => {
    if (isUpdate && password === undefined) return;
    
    if (!password || typeof password !== 'string' || password.trim() === '') {
        throw new Error("ERROR: La contraseña es obligatoria.");
    }
    
    if (password.length < 6) {
        throw new Error("ERROR: La contraseña debe tener al menos 6 caracteres.");
    }
}

const validateAvatar = (file, isUpdate = false) => {

    // En actualización, el archivo es opcional
    if (isUpdate && !file) return;

    if (file) {
        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.mimetype)) {
            throw new Error("ERROR: El avatar debe ser una imagen (jpeg, jpg, png).");
        }
        
        // Validar tamaño
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new Error("ERROR: El avatar no puede superar los 5MB.");
        }
        
    }
}

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

    // Validar ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({msg: 'ERROR: ID de usuario inválido.'});
    }

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
    const file = req.file; // Archivo subido por multer

    // Se verifica los parámetros completos
    if(!user.username || !user.email || !user.password || !user.role){
        return res.status(400).json({msg: "ERROR: Faltan completar parámetros."});
    }

    try {
        await validateUsername(user.username);
        await validateEmail(user.email);
        await validateRole(user.role);
        validatePassword(user.password);
        validateAvatar(file);

        // Si hay archivo, usar la ruta del archivo como avatar
        if (file) {
            user.avatar = file.path;
        }

        const passwordHash = await bcrypt.hash(user.password, salt);
        user.password = passwordHash;

        const doc = new User(user);
        await doc.save();
        res.status(201).json( {msg: "El usuario fue creado con éxito.", data: {id: doc._id, username: doc.username, avatar: doc.avatar || null}} );

    } catch (error) {
        // Si hay error y se subió un archivo, eliminarlo
        if (file && file.path) {
            deleteFile(file.path);
        }

        res.status(400).json({msg: error.message});
    }
    
};

const deleteUser = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({msg: 'ERROR: ID de usuario inválido.'});
    }

    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({msg: 'ERROR: No se encontró el usuario.'});
        }

        // Eliminar archivo de avatar si existe
        if (user.avatar && user.avatar.startsWith('uploads/')) {
            deleteFile(user.avatar);
        }

        await User.findByIdAndDelete(id);
        return res.json({ msg: 'El usuario fue eliminado con éxito.' });

    } catch (error) {
        return res.status(500).json({msg: 'Error en el servidor. No se pudo eliminar el usuario.'});
    
    }
    
};

const updateUser = async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    const file = req.file; // Archivo subido por multer

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({msg: 'ERROR: ID de usuario inválido.'});
    }

    try {
        // Primero se verifica si existe
        const userExist = await User.findById(id);
        if(!userExist) {
            return res.status(404).json({msg: 'ERROR: El usuario que desea editar no existe.'});
        }

        // Guardar avatar anterior para posible eliminación
        const previousAvatar = userExist.avatar;

        if (user.username !== undefined) {
            await validateUsername(user.username, id, true);
        }

        if (user.email !== undefined) {
            await validateEmail(user.email, id, true);
        }

        if (user.role !== undefined) {
            await validateRole(user.role, true);
        }

        if (user.password !== undefined) {
            validatePassword(user.password, true);
            const passwordHash = await bcrypt.hash(user.password, salt);
            user.password = passwordHash;
        }

        validateAvatar(file, true);
        
        // Si hay nuevo archivo
        if (file) {
            user.avatar = file.path;
            
            // Eliminar archivo anterior si existe
            if (previousAvatar && previousAvatar.startsWith('uploads/')) {
                deleteFile(previousAvatar);
            }
        }

        const newUser = await User.findByIdAndUpdate(id, user, {new: true});
        res.json( {msg: 'El usuario fue actualizado con éxito.', data : newUser} );

    } catch (error) {
        if (file && file.path) {
            deleteFile(file.path);
        }

        res.status(400).json({msg: error.message});
    }

};

export {getUsers, getUserById, addUser, deleteUser, updateUser, login};