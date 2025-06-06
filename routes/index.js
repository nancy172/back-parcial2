// Se importa cada ruta
import usersRouter from "./usersRouter.js";
import petsRouter from "./petsRouter.js";
import caretakersRouter from "./caretakersRouter.js";

function routerAPI(app){
    // Se define cada ruta
    app.use('/api/users', usersRouter);
    app.use('/api/pets', petsRouter);
    app.use('/api/caretakers', caretakersRouter);
    
}

export default routerAPI;