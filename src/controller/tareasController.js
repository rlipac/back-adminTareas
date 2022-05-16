import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tarea.js";





const agregarTarea = async(req, res)=>{
   const { proyecto } = req.body

  const proyectoExiste = await Proyecto.findById(proyecto)

  if(!proyectoExiste){
      const error = new Error("el proyecto que ingresastes no existe")
    return res.status(404).json({ msg: error.message})

  }

  if( proyectoExiste.creador.toString() !== req.usuario._id.toString()){   // solo modifica si el lo creo
    const error = new Error("No puedes añadir tareas")
    return res.status(403).json({ msg: error.message})

}

try {

    const tareaExiste = await Tarea.findOne({nombre: req.body.nombre})// comprobando que tarea no exista
    if(tareaExiste){   // solo modifica si el lo creo
        const error = new Error("La tarea ya existe")
        return res.status(403).json({ msg: error.message})
    
    }

    const tareaGuardada = await Tarea.create(req.body);
    res.status(200).json(tareaGuardada)
    
} catch (error) {
    console.log(error)
}

 

  res.end()
   
}

const obtenertarea = async(req, res)=>{
    const { id } =req.params

    const tarea = await Tarea.findById(id).populate('proyecto').select('nombre estado prioridad')
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(403).json({ msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
        return res.status(403).json({ msg: error.message})
    }
    
    console.log(req.usuario)
    res.json(tarea)
}

const actualizartarea= async(req, res)=>{

    const { id } =req.params

    const tarea = await Tarea.findById(id).populate('proyecto') //.select('_id nombre estado prioridad')
    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(403).json({ msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
        return res.status(403).json({ msg: error.message})
    }

        tarea.nombre = req.body.nombre|| tarea.nombre ,
        tarea.descripcion = req.body.descripcion || tarea.descripcion  ,
        tarea.estado = req.body.estado || tarea.estado ,
        tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega,
        tarea.prioridad = req.body.prioridad || tarea.prioridad 
    try{
        const tareaActualizada = await tarea.save();
        res.status(200).json({ tareaActualizada })
}catch(error){
    console.log(error.message)
}

}

const eliminarTarea = async(req, res)=>{
    const { id } =req.params

   const tarea = await Tarea.findById(id).populate('proyecto') //.select('_id nombre estado prioridad')

    if(!tarea){
        const error = new Error("Tarea no encontrada")
        return res.status(403).json({ msg: error.message})
    }

    if(tarea.proyecto.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
        return res.status(403).json({ msg: error.message})
    }


    try {
      
        await tarea.deleteOne()
        res.status(200).json({ tarea })
    } catch (error) {
       console.log(error) 
    }
   
   
    

}

const cambiarEstadoTarea = async(req, res)=>{}

export {
    agregarTarea,
    obtenertarea,
    actualizartarea,
    eliminarTarea,
    cambiarEstadoTarea
}