import mongoose from "mongoose";

const tareaSchema = mongoose.Schema({
    nombre:{
        type:String,
        trim:true,
        required:true
    },
    descripcion:{
        type:String,
        trim:true,
        required:true
    },
    estado:{
        type:Boolean,
        default:false
    },
    fechaEntrega:{
        type:Date,
        required:true,
        default: Date.now()
    },
    prioridad:{
        type:String,
        trim:true,
        enum:["Baja", "Media", "Alta"]
    },
    proyecto:{
         type:mongoose.Schema.Types.ObjectId, // id del proyecto asociado
         ref:"Proyecto" // Modelo     asociado
    
    }
},
{
    timestamps:true
});

const Tarea = mongoose.model("Tarea", tareaSchema);

export default Tarea;