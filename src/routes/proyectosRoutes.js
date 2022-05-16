import express from 'express'
import { checkAuth } from '../middleware/atuthenticar.js'
import { 
         editarProyecto, 
         deleteProyectoCreadoPorUsuario,
         addColaborador,
         deleteColaborador,
         nuevoProyecto,
         listarProyectosPorUsuario,
         obtenerProyectoYtareas} from '../controller/proyectoController.js'

         const router = express.Router() // creammo un nueva instancia del router con la funcioon Router de expres

         // rutas  anidadas // el front tiene que estar validado con el jwtToken
        router
           .route("/")
           .get(checkAuth, listarProyectosPorUsuario)
           .post(checkAuth, nuevoProyecto)

           
      //   router.post("/add",checkAuth, nuevoProyecto)

        router
           .route("/:id")
           .get(checkAuth, obtenerProyectoYtareas)
           .put(checkAuth, editarProyecto)
           .delete(checkAuth, deleteProyectoCreadoPorUsuario)

      //  router.get("/tareas/:id", checkAuth, obtenerTareas)
        router.post("/agregar-colaborador/:id", checkAuth, addColaborador)
        router.post("/eliminar-colaborador/:id", checkAuth, deleteColaborador)   
 
         export default router;

