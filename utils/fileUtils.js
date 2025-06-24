import fs from 'fs';
import path from 'path';

const deleteFile = (filePath) => {
    if (filePath && typeof filePath === 'string') {
        const fullPath = path.join(process.cwd(), filePath);
        fs.unlink(fullPath, (err) => {
            if (err && err.code !== 'ENOENT') {
                console.error('Error al eliminar archivo:', err);
            }
        });
    }
};

export { deleteFile };