
import Usuario from '../models/Usuario.js'
import generarTokenId from '../helpers/generarTokenId.js';
import generarJWT from '../helpers/generarJWT.js';
import { emailRegistro } from '../helpers/email.js';




const registrar = async (req, res) => {
    const { email } = req.body;

    const usuariExiste = await Usuario.findOne({ email: email })

    if (usuariExiste) {
        const error = Error(`el email ${usuariExiste.email} ya esta registrado por el usuario ${usuariExiste.nombre}`);
        return res.status(400).json({
            mensage: error.message
        })
    }

    try {
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

            mensage: "Usuario registrado correactamente -revisa tu email para confirmar tu cuenta"

        })

    } catch (error) {
        console.log(error)
    }
    res.end()

}

const authenticar = async (req, res) => {
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

            mensage: error.message
        })
        console.log("es Incorrecto --->  ;-(")
    }
    res.end()

}

const confirmar = async (req, res) => {


    const { token } = req.params;
 
    const usuarioComfirmado = await Usuario.findOne({ token })
    if (!usuarioComfirmado) {
        const error = new Error(`Token no encontrado o token invalido`)
        return res.status(403).json({ mensage: error.message })
    }

    try {
        usuarioComfirmado.confirmado = true;
        usuarioComfirmado.token = "";
        await usuarioComfirmado.save();
        console.log(usuarioComfirmado)
        return res.status(200).json({

            mensage: `Felicitaciones ${usuarioComfirmado.nombre} has confirmado correctamente...!!!`
        })
    } catch (error) {
        console.log(error)
    }

    res.end()
}

const resetPassword = async (req, res) => {
    const { email } = req.body;
    const usuario = await Usuario.findOne({ email })
    if (!usuario) {
        const error = new Error("Usuario No existe")
        return res.status(401).json({ msg: error.message })
    }
    try {
        usuario.token = generarTokenId()
        await usuario.save()
        res.json({
            token: usuario.token,
            msg: "password reseteado",

        })

    } catch (error) {
        console.log(error)

    }

    res.end()
}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const tokenValido = await Usuario.findOne({ token })

    if (tokenValido) {
        res.json({
            tokenValido,
            msg: "password reseteado"
        })

    } else {
        const error = new Error(`token invalido`)
        return res.status(403).json({

            mensage: error.message
        })
    }
    res.end()
}

const nuevoPassword = async (req, res) => {
    const { token } = req.params;
    const { claveNueva } = req.body;

    const usuario = await Usuario.findOne({ token });

    if (usuario) {
        usuario.password = claveNueva;
        usuario.token = '';
        await usuario.save()
        res.json({ usuario, msg: "Password Cambiado correctamente" })
    } else {
        const error = new Error(`Error, token invalido`)
        return res.status(403).json({ mensage: error.message })
    }
}

const perfil = (req, res) => {

    console.log("desde perfifl--->")
    res.end()
}

const listarUsuarios = async (req, res) => {

    const usuarios = await Usuario.find()
    return res.status(200).json({ usuarios: usuarios })
}


export {
    registrar,
    authenticar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword,
    perfil,
    listarUsuarios
}