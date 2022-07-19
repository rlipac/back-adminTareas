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
// app.use(cors()) // Metodo  simple y basico cors

const whiteList =[process.env.FRONTEND_URL] // url servidor Front
 // cor con optionps
const corsOptions = {
    origin: function(origin, callback){
        if(whiteList.includes(origin)){
            // puede consultar la API
            callback(null, true);
        }else{
            // no esa Autorizado 
            callback( new Error("error en cors"));
        }
    }
  }

app.use(cors(corsOptions)) ; 


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
    
//  socket.on('hola', (proyectos)=>{
//     console.log('el fron me saludo otra vez ', proyectos );

//     socket.emit('respuesta')
//  }) 

    socket.on('abrir proyecto', (proyecto)=>{
        console.log('id del proyecto s.io ', proyecto)
        socket.join(proyecto);

        socket.to('62d5b93f22377d990127ba6a').emit('respuesta', { nombre: 'richard Lipa'})
    })

});
    
} catch (error) {
    console.log( '--->', error)
}
