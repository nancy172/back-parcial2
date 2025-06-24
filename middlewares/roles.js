import Person from "../models/PersonModel.js";

const isCaretaker = async (req, res, next) => {
    const { role, id } = req.user;

    try {
        if (role === 'refugio') {
            return next();
        }

        if (role === 'persona') {
            const person = await Person.findOne({ userId: id });

            if (person && person.canGiveForAdoption) {
                return next();
            } else {
                return res.status(403).json({ msg: "Acceso denegado: No tiene permisos para gestionar mascotas." });
            }
        }

        if (role === 'admin') {
            return next();
        }

        return res.status(403).json({ msg: "Acceso denegado: No tiene permisos suficientes." });
    } catch (error) {
        return res.status(500).json({ msg: "Error al verificar permisos." });
    }
};

export { isCaretaker };
