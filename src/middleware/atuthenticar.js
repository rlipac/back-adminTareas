import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

const checkAuth =  async (req, res, next )=>{
    console.log("hola desde checkAuth")
    let jwtToken;

if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
    try {
         jwtToken = req.headers.authorization.split(" ")[1]; // crea un array y elemina el espacio en blaco luego guarda solo el elemto en la pociion 1 del array
         const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET  );
        //  req.usuario = await Usuario.findById(decoded.id).select("-email -password -token -confirmado",); // creacmo la variable usuario en el request con el ID que viene el el jwtToken  para poder manejar las sesiones de ese usuario
          req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v"); // select("coloca el o los campos que quieres excluir en la respuesta") 
        console.log(`datos del Usuario ==> : ${req.usuario}`) // req.usuario sirve para identificar al usuario/ se lansa al ejecutar cada ruta
        return next()
    }catch (error) {    
        console.log(error)
        return res.status(404).json({ msg: error})
       
    } 
}
if(!jwtToken){
    const error = new Error("NO tienes Token")
    return res.status(404).json({ msg: error.message })
}
    next() // ejecuta la siguiente funcion
}

export  {
    checkAuth
}

