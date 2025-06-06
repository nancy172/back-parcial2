import Caretaker from "../models/CaretakerModel.js";

// Validaciones
const validateCaretaker = (caretaker, isUpdate = false) => {
    const okTypes = ['refugio', 'particular'];

    if(!isUpdate || caretaker.name !== undefined){
        if (!caretaker.name || typeof caretaker.name !== 'string' ||  caretaker.name.trim() === '') {
            throw new Error("ERROR: El nombre del responsable debe ser un texto y no puede quedar vacío.");
        }
    }

    if(!isUpdate || caretaker.contact !== undefined){
        if (!caretaker.contact || typeof caretaker.contact !== 'string' ||  caretaker.contact.trim() === '') {
            throw new Error("ERROR: La descripción de la mascota debe ser un texto y no puede quedar vacío.");
        }
    } 

    if(!isUpdate || caretaker.type !== undefined){
        if( !caretaker.type || typeof caretaker.type !== 'string' || !okTypes.includes(caretaker.type.toLowerCase()) ) {
            throw new Error("ERROR: El tipo de responsable debe ser 'refugio' o 'particular'.");
        }
    }

    if (!isUpdate || caretaker.acceptsVisits !== undefined) {
        if (typeof caretaker.acceptsVisits !== 'boolean') {
            throw new Error("ERROR: El campo 'acceptsVisits' debe ser true o false.");
        }
    }

};

// Controladores
const getCaretakers = async (req, res) => {
    try {
        const caretakers = await Caretaker.find();
        res.status(200).json(caretakers);
    } catch (error) {
        res.status(500).json({msg: 'ERROR: No se pudo obtener la lista de cuidadores.'});
    }
    
};

const getCaretakerById = async (req, res) => {
    const id = req.params.id;
    try {
        const caretaker = await Caretaker.findById(id);
        if(caretaker){
            res.status(200).json(caretaker);
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró el cuidador.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo obtener el cuidador.'});
    }
    
};

const addCaretaker = async (req, res) => {
    const caretaker = req.body;

    // Se verifica los parámetros completos
    if(!caretaker.name || !caretaker.contact ||!caretaker.type || !caretaker.acceptsVisits){
        return res.status(400).json({msg: "ERROR: Faltan completar parámetros."});
    }

    try {
        validateCaretaker(caretaker);

        const doc = new Caretaker(caretaker);
        await doc.save();

        res.status(201).json( {msg: "El cuidador fue creado con éxito.", data: doc});   

    } catch (error) {
        res.status(400).json({msg: error.message});
    }
    
};

const deleteCaretaker = async (req, res) => {
    const id = req.params.id;
    try {
        const status = await Caretaker.findByIdAndDelete(id);
        if (status) {
            res.json( {msg: 'El cuidador fue eliminado con éxito.'} );
        } else {
            res.status(404).json({msg: 'ERROR: No se encontró el cuidador.'});
        }

    } catch (error) {
        res.status(500).json({msg: 'Error en el servidor. No se pudo eliminar el cuidador.'});
    }
    
};

const updateCaretaker = async (req, res) => {
    const id = req.params.id;
    const caretaker = req.body;

    try {
        // Primero se verifica si existe
        const petExists = await Caretaker.findById(id);
        if(!petExists) {
            return res.status(404).json({msg: 'ERROR: El cuidador que desea editar no existe.'});
        }

        // Validación para solo lo que se quiere actualizar
        validateCaretaker(caretaker, true);

        const newCaretaker = await Caretaker.findByIdAndUpdate(id, caretaker, {new: true});
        res.json( {msg: 'El cuidador fue actualizado con éxito.', data : newCaretaker} );

    } catch (error) {
        res.status(400).json({msg: error.message});
    }

};

const filterCaretakers = async (req, res) => {

    try {

        const {type, acceptsVisits} = req.query;    // Con query se extraen los valores de los parámetros de la url

        const filter = {};
        
        // Filtro y validación por tipo de cuidador:
        if ( type && type.trim() !== ""  ) {
            filter.type = type.toLowerCase(); 
        }

        // Filtro y validación por aceptación de visitas:
        if (acceptsVisits !== undefined) {
            const validVisits = acceptsVisits === 'true' || acceptsVisits === 'false';
            if (!validVisits) {
                return res.status(400).json({ msg: "El valor de 'acceptsVisits' debe ser 'true' o 'false'." });
            }
            filter.acceptsVisits = acceptsVisits === 'true'; // Se convierte a booleano
        }

        // Se verifica si el objeto filter está vacío
        if (Object.keys(filter).length === 0) {
            return res.status(400).json({ msg: "Filtro inválido. Intente nuevamente." });
        }

        // Se buscan los cuidadores filtrados
        const caretakers = await Caretaker.find(filter);

        if (caretakers.length === 0) {
            return res.status(404).json( {msg: "No se encontraron resultados."} );
        }

        res.json( {data: caretakers} );


    } catch (error) {
        res.status(500).json( {msg: error.message} );
        
    }

};

const searchCaretakerByName = async (req, res) => {
    try {
        const { name } = req.query;    // Se extrae el valor del nombre de la URL

        if (!name) {
            return res.status(400).json({ msg: "El nombre del cuidador es obligatorio para realizar la búsqueda." });
        }

        const caretakers = await Caretaker.find({});

        // Se filtra todas las mascotas con el mismo nombre
        const caretakersFiltered = caretakers.filter( p => p.name.toLowerCase().includes(name.toLowerCase()) );

        if (caretakersFiltered.length === 0) {
            return res.status(404).json({ msg: "No se encontraron cuidadores con ese nombre." });
        }

        res.json({ data: caretakersFiltered });

    } catch (error) {
        
        res.status(500).json({ msg: error.message });
    }
};


export {getCaretakers, getCaretakerById, addCaretaker, deleteCaretaker, updateCaretaker, filterCaretakers, searchCaretakerByName};