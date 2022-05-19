// pprimero colocar esta linia en el ppakage.json despues de "descripcion" para poder utilizar import --  "type": "module",
import express from 'express'
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


// const corsOptions = {
//     origin: 'http://localhost:3000/',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
//   }

// app.use(cors(corsOptions)) ; 


// Routing
app.use("/API/usuarios",  usuarioRouters);
app.use("/API/proyectos",  proyectosRoutes);
app.use("/API/tareas",  tareasRoutes);
const port = process.env.PORT || 4200;


try {
    app.listen(port, ()=>{
        console.log(`escuchado en el puerto  ${port} todo ok`);
    } )
    
} catch (error) {
    console.log( '--->', error)
}
