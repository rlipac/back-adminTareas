
import express from 'express'

import Usuario from '../models/Usuario.js'
import generarTokenId from '../helpers/generarTokenId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro, resetPassword } from '../helpers/email.js';


const crearAdmin = async () => {
    try {
            const data = {
                nombre:'ADMIN',
                email:'usuario@admin.com',
                password:'123456',
                token:'', // llenamos el campo token del Modelo usuario
                confirmado:true
            }
            const usuariExiste = await Usuario.findOne({ email: data.email })

            if (!usuariExiste) {
                const usuario = new Usuario(data)
                await usuario.save()
              return  console.log(`el usuario ${data.email} a sido creado correctamente`);
            }
            const error = Error(`el email ${usuariExiste.email} ya esta registrado por el usuario ${usuariExiste.nombre}`);
          return  console.log(`el usuario ${usuariExiste.email} ya esta registrado`)
            

    } catch (error) {
      return  console.log(error)      
    }
 
}

crearAdmin();//? llamado a la funcion que crea al admin


const authenticar = async (req, res) => {

    try {
            const { email, password } = req.body;
            // comprobando si existe el usuario
            const usuario = await Usuario.findOne({ email })
            if (!usuario) {
                const error = new Error(`El usuario con el ${email} no existe`)
                return res.status(400).json({
                    mensage: error.message
                })
        
            }// conrpbando si esta confirmado
            if (!usuario.confirmado) {
                const error = new Error(`El usuario con el ${email} no esta Confirmado`)
                return res.status(400).json({
                    mensage: error.message
                })  
            }
            if (await usuario.comprobarPassword(password)) {// pasamoms como parametro el password ingresado por el cliente
                return res.status(200).json({
                    _id: usuario._id,
                    nombre: usuario.nombre,
                    email: usuario.email,
                    jwtToken: generarJWT(usuario._id),// generamos el token al usuario despues de logueare correactamente // le pasamos el id del usuario
                    mensage: "Usuario logueado"
                })
        
            } else {
                const error = new Error(`La contraseña es invalida`)
                return res.status(403).json({
        
                    mensage: error
                })
                
            }
    } catch (error) {
            return res.status(403).json({
                msg:`${error}`
        })
}

}

const listarUsuarios = async (req, res) => {
   
    try {

        const usuarios = await Usuario.find();
        let arrayUsuarios = []; 
        for( let usuario in usuarios){
             arrayUsuarios.push(usuario)
        }
        const totalUsuarios = arrayUsuarios.length

        return res.status(200).json({
             totalUsuarios,
             usuarios: usuarios
             })

             console.log('listar usuarios')
        
    } catch (error) {
        return res.status(403).json({ msg:`${error}` })
    }

   
}


const registrar = async (req, res) => {
    

    try {
        const { email } = req.body;
        const isValidarEmail =(email)=>{
            return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
               
          }

          isValidarEmail(email)
    
          if( isValidarEmail(email) === false){
            console.log(`el email ${email} no es valido`)
            return res.status(400).json({
                msg: `el email ${email} no es valido`
            })
          }

        const usuariExiste = await Usuario.findOne({ email: email })

        if (usuariExiste) {
            const error = Error(`el email ${usuariExiste.email} ya esta registrado por el usuario ${usuariExiste.nombre}`);
            return res.status(400).json({
                msg: error.message
            })
        }
        const usuario = new Usuario(req.body)
        usuario.token = generarTokenId(); // llenamos el campo token del Modelo usuario
        await usuario.save()


        // Enviar correo de confirmacion de usurio
        emailRegistro({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })

        res.json({

            mensage: `Usuario ${email} registrado correactamente -revisa tu email para confirmar tu cuenta`

        })

    } catch (error) {
        return res.status(400).json({
            mensage: `${error}`
        })
    }
    res.end()

}



const confirmar = async (req, res) => {


    try {
        const { token } = req.params;
 
        const usuarioComfirmado = await Usuario.findOne({ token })
        if (!usuarioComfirmado) {
            const error = new Error(`Token no encontrado o token invalido`)
            return res.status(403).json({ mensage: error.message })
        }
        usuarioComfirmado.confirmado = true;
        usuarioComfirmado.token = "";
        await usuarioComfirmado.save();
        //console.log(usuarioComfirmado)
        return res.status(200).json({

            msg: `Felicitaciones ${usuarioComfirmado.nombre} has confirmado correctamente...!!!`
        })
    } catch (error) {
        return res.status(400).json({
            mensage: `${error}`
        })
    }

    res.end()
}

const comprobarToken = async (req, res) => {
    try {

        const { token } = req.params;
    
        const tokenValido = await Usuario.findOne({ token })
        if (tokenValido) {
            res.json({
                token:tokenValido.token,
                msg: "token Valido"
            })
    
        } else {
            const error = new Error(`token invalido...`)
            return res.status(403).json({
    
                mensage: error.message
            })
        }
        
    } catch (error) {
        return res.status(403).json({
    
            mensage: `${error}`
        })
    }
    
    res.end()
}


const olvidePassword = async (req, res) => {
    console.log('olvide password..')
    
    try {
        const { email } = req.body;
       // console.log(email, '---mi email')
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
        const error = new Error("Usuario No existe")
        return res.status(401).json({ msg: error.message })
        }
        usuario.token = generarTokenId()
        await usuario.save()

        // enviar email para crear nuevo password
        resetPassword({
            email: usuario.email,
            nombre: usuario.nombre,
            token: usuario.token
        })
        res.json({
            // token: usuario.token,
            msg: `Hola ${usuario.nombre} te enviamos un email con las intrucciones`,
            // usuario

        })

    } catch (error) {
        console.log(error)

    }

    res.end()
}


const nuevoPassword = async (req, res) => {

    try {
        console.log('Nuevo password...')
        const { token } = req.params;
       
        const { newPassword } = req.body;

        const usuario = await Usuario.findOne({ token:`${token}` });
     //   console.log(usuario)
        if (!usuario) {
            const error = new Error(`Error, token invalido`)
            return res.status(403).json({ msg: error.message })
        
        } 
        usuario.password = newPassword;
        usuario.token = '';
        await usuario.save()
       return  res.status(200).json({  msg: "Password Cambiado correctamente" })
    } catch (error) {
        return  res.status(400).json({  msg: `${error}` })
    }
    
   
}

const obtenerUsuario = async (req, res) => {
    console.log('obtener usuario...')
    try {
        const { id }= req.params;

        const usuario = await Usuario.findById(id)
        if(!usuario){
            return  res.status(400).json({  msg: ` el usuario con el id: ${id} no esta registrado` }) 
        }
        return res.status(200).json({ usuario})
    } catch (error) {
        return  res.status(400).json({  msg: `${error}` })
    }
   res.end()
}

const perfil = (req, res) => {
    console.log('perfill....')
  try {
     const { usuario } = req;
     //console.log(' ==>  ',req.usuario)
     return res.status(200).json(usuario)
  } catch (error) {
    console.log('--> ',error)
    return res.status(400).json({
        msg:error
    })
  }

}

export {
    registrar,
    authenticar,
    confirmar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    listarUsuarios,
    obtenerUsuario
}