import mongoose from "mongoose";

const proyectosSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim:true,
        required:true
    },
    descripcion:{
        type:String,
        trim:true, // elimina los espacios en blaco de que estan demas
        required:true
    },
    fechaEntrega:{
        type: Date,
        default:Date.now()
    },
    cliente:{
        type:String,
        trim: true,
        required:true
    },
    creador:{
        type:mongoose.Schema.Types.ObjectId, // id del creador
        ref: "Usuario", // Modelo Usuario
    },
    colaboradores: [ // es un array de objetos porque pueden aver varios colaboradores
        {
            type:mongoose.Schema.Types.ObjectId, // id del creador
             ref: "Usuario", // Modelo Usuario

        }
    ]

},
{
    timestamps: true // cuando fue cread y actualizada
});

const Proyecto = mongoose.model("Proyecto", proyectosSchema);


export default Proyecto;
