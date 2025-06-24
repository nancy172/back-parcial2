import  jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const secret_key = process.env.SECRET_KEY;

// Middleware para validar JWT
const validateToken = (req, res, next) => {
    const auth = req.headers.authorization;

    if(!auth){
        return res.status(401).json({msg: "Token de autorización requerido"});
    }

    const token =  auth.split(' ')[1];

    // Se verifica si el token existe después del split
    if (!token) {
        return res.status(401).json({ msg: "Token no encontrado" });
    }

    // Se verifica y se decodifica el token
    jsonwebtoken.verify(token, secret_key, ( error, decoded ) => {
        if(error){
            return res.status(403).json({msg: "Token inválido o expirado"});
        }

        // Se verifica si el token decodificado contiene el ID del usuario
        if (!decoded || !decoded.id) {
            return res.status(403).json({ msg: "Token mal formado" });
        }

        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        next();

    });

}


export {validateToken};