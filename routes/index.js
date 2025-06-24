// Se importa cada ruta
import usersRouter from "./usersRouter.js";
import petsRouter from "./petsRouter.js";
import personsRouter from "./personsRouter.js";
import refugesRouter from "./refugesRouter.js";

function routerAPI(app){
    // Se define cada ruta
    app.use('/api/users', usersRouter);
    app.use('/api/pets', petsRouter);    
    app.use('/api/persons', personsRouter);    
    app.use('/api/refuges', refugesRouter);    
}

export default routerAPI;