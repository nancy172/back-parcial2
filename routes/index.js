// Se importa cada ruta
import usersRouter from "./usersRouter.js";
import petsRouter from "./petsRouter.js";

function routerAPI(app){
    // Se define cada ruta
    app.use('/api/users', usersRouter);
    app.use('/api/pets', petsRouter);    
}

export default routerAPI;