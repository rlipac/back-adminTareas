// primero colocar esta linia en el pakage.json despues de "descripcion" para poder utilizar import --  "type": "module",
import express from 'express'
// socket
import { Server } from 'socket.io';

// 
import dotenv from 'dotenv'// para cargar nuetras variables de entorno
import conexionDB from './config/db.js';
import cors from 'cors'


//
import usuarioRouters from './routes/usuarioRoutes.js'
import proyectosRoutes from './routes/proyectosRoutes.js'
import tareasRoutes from './routes/tareasRoutes.js'

const app = express();
// Midlewares

app.use(express.json())// para que pueda leer el body


dotenv.config() // para que cargue nuetras avriables de entorno

conexionDB()

// configuarion de cors
 app.use(cors()) // Metodo  simple y basico cors

//? Cor con optionps


/// cor ejemplo solo admite solicitudes a la lista blanca

// const  whiteList =[process.env.FRONTEND_URL]
// const corsOptions = {
//   origin: function (origin, callback) {
//     if (whiteList.indexOf(origin) !== -1) {
//       callback(null, true)
//     } else {
//       callback(new Error('Not allowed by CORS'))
//     }
//   }
// }
 

///fin ejemplo


// Routing
app.use("/API/usuarios",  usuarioRouters);
app.use("/API/proyectos",  proyectosRoutes);
app.use("/API/tareas",  tareasRoutes);

const port = process.env.PORT || 4200;

try {

 const servidor = app.listen(port, ()=>{
        console.log(`escuchado en el puerto  ${port} todo ok`);
    } )

// tiene que ser igual los cors

   const io = new Server(servidor,  { /* options */ 
            pingTimeout:60000,
            cors:{
                
              origin: process.env.FRONTEND_URL,
            }

        });

io.on("connection", (socket) => {
  console.log('soket  -> se concto con el front')


    socket.on('abrir proyecto', (id)=>{
       socket.join(id);// entra a la sala

        // socket.to(id).emit("respuesta", {nombre:' Richard', id:id } );

       
    });

    socket.on('nueva tarea', (tarea)=>{ //
        const idProyecto = tarea.proyecto; // obtenemos elid del proyecto
       socket.to(idProyecto).emit('tarea agregada', tarea);// recibimos el id y devolvemos la tarea al front
   })  

   socket.on('eliminar tarea', (tarea)=>{
    const idProyecto = tarea.proyecto; // obtenemos elid del proyecto
    socket.to(idProyecto).emit('tarea eliminada', tarea)
   })

   socket.on('editar tarea', (tarea)=>{
  
    const idProyecto = tarea.proyecto._id; // obtenemos elid del proyecto
    socket.to(idProyecto).emit('tarea actualizada', tarea)
   })


   socket.on('cambiar estado', (tarea)=>{
  
    const idProyecto = tarea.proyecto._id; // obtenemos elid del proyecto
    socket.to(idProyecto).emit('estado actualizado', tarea)
   })
   socket.on('agregar colaborador', (proyecto)=>{
        const idColaborador = proyecto.colaborador._id;
        socket.to(idColaborador).emit('proyecto asignado', proyecto)

   })

   

});
    
} catch (error) {
    console.log( '--->', error)
}
