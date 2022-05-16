import jwt from "jsonwebtoken";

const generarJWT = (id)=>{ // recibe el id del usuario como parametro, para generar el token unico para ese usuario
    // jwt toma dos valores -> el nobre del usuario y la palabra secreta del token 
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: "10d", // expira en 10 dias
    }) 
}   

export default generarJWT;