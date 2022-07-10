import mongoose from "mongoose";  //"bcrypt"
import bcrypt from "bcrypt"

const UsuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true // elimina los espacios innecesarios agregados por el cliente en el front
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    token: {
        type: String
    },
    confirmado: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
); // timestamps crea un cregistro de fecha de creado y actualizado

//leer doc PRE // https://mongoosejs.com/docs/middleware.html#pre
UsuarioSchema.pre('save', async function(next) { // se ejecuta antes de guardar usuarios

    // }
    if (!this.isModified('password')) return next();// si el password no ha sido modificado, seguir con el siguiente Midleware // si ya esta hasheado sigue de largo sino lo hashea
    
    const salt = await bcrypt.genSalt(10) // salt numero de vueltas para hashear el password
    // this => hace referencia al obgeto Usuario del modelo
    this.password = await bcrypt.hash(this.password, salt) // primer parametro el password ingresado , segundo el salt creado arriba
    next();
  });

  UsuarioSchema.methods.comprobarPassword = async function(passwordCliente){ // le pasamos el password que ingreso en el forulario
      return await bcrypt.compare(passwordCliente, this.password); // con la funcion compare de bcrypt comparamos el pasworod ingresado con el pasword guardado el la BD
  }







const Usuario = mongoose.model('Usuario', UsuarioSchema)// creamos el modelo Usuario


export default Usuario; // exportamos el modelo usuario para poder utulizarlo en el controlador