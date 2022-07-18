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
        default:false,
        required: true
    },
    fechaEntrega:{
        type:Date,
        defaul: Date.now(),
        require:true
       
    },
    prioridad:{
        type:String, 
        require:true,
        trim:true,
        enum:["Baja", "Media", "Alta"]
    },
    proyecto:{
         type:mongoose.Schema.Types.ObjectId, // id del proyecto asociado
         ref:"Proyecto" // Modelo     asociado
    
    },
    completado:{
        type:mongoose.Schema.Types.ObjectId, // id del proyecto asociado
        ref:"Usuario" // Modelo     asociado
   
   }

},
{
    timestamps:true
});

const Tarea = mongoose.model("Tarea", tareaSchema);

export default Tarea;