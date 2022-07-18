import express from 'express'
import { checkAuth } from '../middleware/atuthenticar.js';


import { actualizartarea,
         agregarTarea,
          cambiarEstadoTarea,
          eliminarTarea,
          obtenertarea
 } from '../controller/tareasController.js'


 const router = express.Router()

 router.post("/", checkAuth, agregarTarea)
  

 router
    .route("/:id")
    .get(checkAuth,obtenertarea)
    .put(checkAuth, actualizartarea)
    .delete(checkAuth, eliminarTarea)

router.post("/estado/:id", checkAuth, cambiarEstadoTarea)   

   

 export default router;