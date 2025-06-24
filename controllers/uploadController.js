const uploadController = (req, res) => {
    try {
        if(!req.file) {
            return res.status(422).json({msg: 'No se pudo subir el archivo'});
        }

        res.status(200).json({msg: 'Archivo subido correctamente', file: req.file});
        
    } catch (error) {
        console.error('Error al subir archivo:', error.message);
        res.status(500).json({msg: 'Error al subir el archivo'});
    }
}

export default uploadController;