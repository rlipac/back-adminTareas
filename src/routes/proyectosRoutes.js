import express from 'express'
import { checkAuth } from '../middleware/atuthenticar.js'
import { 
         eliminarColaborador,
         editarProyecto,
         obtenerProyectoId, 
         deleteProyectoCreadoPorUsuario,
         nuevoProyecto,
         listarProyectosPorUsuario,
         obtenerProyectoYtareas,
         addColaborador,
         searchColaborador
        } from '../controller/proyectoController.js'

         const router = express.Router() // creammo un nueva instancia del router con la funcioon Router de expres

         // rutas  anidadas // el front tiene que estar validado con el jwtToken
        router
           .route("/")
           .get(checkAuth, listarProyectosPorUsuario)
           .post(checkAuth, nuevoProyecto)
 
           
   router.post("/",checkAuth, nuevoProyecto)

        router
           .route("/:id")
           .get(checkAuth, obtenerProyectoYtareas)
         //   .get(checkAuth, obtenerProyectoId)
           .put(checkAuth, editarProyecto)
           .delete(checkAuth, deleteProyectoCreadoPorUsuario)

      //  router.get("/tareas/:id", checkAuth, obtenerTareas)
       // router.get("misproyectos/:id",checkAuth, obtenerProyectoYtareas)
        router.post("/colaborador", checkAuth, searchColaborador)
        router.post("/colaborador/:id", checkAuth, addColaborador)
        router.post("/eliminar-colaborador/:id", checkAuth, eliminarColaborador)
      
 
 export default router;

