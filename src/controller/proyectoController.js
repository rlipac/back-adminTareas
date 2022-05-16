
import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tarea.js";

const listarProyectosPorUsuario = async(req, res)=>{
    const proyectos = await Proyecto.find().where("creador").equals(req.usuario)
    const totalProyectos = await Proyecto.count().where("creador").equals(req.usuario)
    res.json({
        totalProyectos,
        creador: req.usuario.nombre,
        proyectos,
        msg:"proyectos lista"})
    

}
const nuevoProyecto = async(req, res)=>{

    const { nombre } = req.body;

    const proyectoExiste= await Proyecto.findOne({ nombre: nombre })

    if(proyectoExiste){
        return res.json({ msg: "El Proyecto ya existe"})
    }

    const proyecto = new Proyecto(req.body) // guardamos proyecto lo que se manda por el formulario
     proyecto.creador = req.usuario._id;

   try {
       const proyectoAlmacenado = await proyecto.save()
       
    console.log(proyectoAlmacenado)
    res.json(proyectoAlmacenado)
       
   } catch (error) {
    console.log(error.message)
   }
   res.end()

}
const obtenerProyectoYtareas = async(req, res)=>{
    const { id } = req.params


    const proyecto = await Proyecto.findById(id)
      
    if(!proyecto){   // verificando si existe proyecto
      
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message})
    }
    if( proyecto.creador.toString() !== req.usuario._id.toString()){   // solo modifica si el lo creo
        const error = new Error("Accion no valida ")
        return res.status(403).json({ msg: error.message})

    }


     try {
        const tareas = await Tarea.find().where("proyecto").equals(proyecto._id)
        if(tareas.length == 0){
            const error = new Error("No has creado tareas todavia ")
         return res.status(201).json({ proyecto, msg: error.message})
        }

        res.json({ proyecto, tareas })
      
   } catch (error) {
       console.log(error)
   }


}
const editarProyecto = async(req, res)=>{
    const { id } = req.params

    const proyecto = await Proyecto.findById(id)
    if(!proyecto){   // verificando si existe proyecto
      
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message})
    }
    if( proyecto.creador.toString() !== req.usuario._id.toString()){   // solo modifica si el lo creo
        const error = new Error("Accion no valida ")
        return res.status(403).json({ msg: error.message})

    }
   
    proyecto.nombre = req.body.nombre || proyecto.nombre // cambiamos el nombre envieado por el front o mantenemos el mimo nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega
    proyecto.cliente = req.body.cliente || proyecto.cliente


    try{
        const proyectoAlmacenado = await proyecto.save();
        res.status(200).json({ proyectoAlmacenado })
}catch(error){
    console.log(error.message)
}



}
const deleteProyectoCreadoPorUsuario = async(req, res)=>{
    const { id } = req.params

    const proyecto = await Proyecto.findById(id)
    if(!proyecto){   // verificando si existe proyecto
      
        const error = new Error("Proyecto no encontrado")
        return res.status(404).json({ msg: error.message})
    }
    if( proyecto.creador.toString() !== req.usuario._id.toString()){   // solo modifica si el lo creo
        const error = new Error("Accion no valida ")
        return res.status(403).json({ msg: error.message})

    }
   
    try {

        await proyecto.deleteOne()
        res.status(200).json({ mgs:" proyecto eliminado" })
        
    } catch (error) {
            console.log(error.message)
    }


}
const addColaborador = async(req, res)=>{

}
const deleteColaborador = async(req, res)=>{

}

const obtenerTareas = async(req, res)=>{

}

 export {
     listarProyectosPorUsuario,
     nuevoProyecto,
     obtenerProyectoYtareas,
     editarProyecto,
     deleteProyectoCreadoPorUsuario,
     addColaborador,
     deleteColaborador,
     obtenerTareas
 }