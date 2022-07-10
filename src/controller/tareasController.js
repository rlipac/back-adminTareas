import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tarea.js";





const agregarTarea = async (req, res) => {

    console.log('save tarea => ', req.body);
    try {

        const { proyecto } = req.body
        const idUsuario = req.usuario._id.toString();
        console.log('id -> ',  proyecto,' ', idUsuario)

        const proyectoExiste = await Proyecto.findById(proyecto).where('creador').equals(idUsuario)
        
        const creadorId = proyectoExiste.creador.toString();
        console.log('proyecto existe -> ',proyectoExiste)
      

        if (!proyectoExiste) {
            const error = new Error("el proyecto que ingresastes no existe")
            return res.status(404).json({ msg: error.message })

        }

        if (creadorId !== idUsuario){   // solo modifica si el lo creo
            const error = new Error("No puedes añadir tareas")
            return res.status(403).json({ msg: error.message })

        }

        const tarea = await Tarea.findOne({ nombre: req.body.nombre })
            .where('proyecto').equals(proyecto)
            .where('creador').equals(idUsuario)
        if (tarea) {   // solo modifica si el lo creo
            const error = new Error("La tarea ya existe")
            return res.status(403).json({ msg: error.message })

        }

        const tareaGuardada = await Tarea.create(req.body);
        console.log("controller fecha entrega ==>",req.body.fechaEntrega);
        res.status(200).json({
            tareaGuardada
        })

         proyectoExiste.tareas.push(tareaGuardada._id); //aqui se guarda la tarea en el array atreas del Modelo Proyecto
        await proyectoExiste.save(); // se guarda los cabios en la BD de MondoDB
    } catch (error) {
        console.log(error)
    }



    res.end()

}

const obtenertarea = async (req, res) => {
    console.log('obtener tarea...')
    try {

        const { id } = req.params
        const tarea = await Tarea.findById(id).populate('proyecto', '-__v -createdAt -updatedAt')
                                              .select('-__v -createdAt -updatedAt')
        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(403).json({ msg: error.message })
        }
    
        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
            return res.status(403).json({ msg: error.message })
        }
    
        
        res.json({tarea})
    
        
    } catch (error) {
        return res.status(403).json({ msg: error }) 
    }
}

const actualizartarea = async (req, res) => {

    
    try {

        const { id } = req.params

        const tarea = await Tarea.findById(id).populate('proyecto', '-tareas')//.select('_id nombre estado prioridad')
        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(403).json({ msg: error.message })
        }

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
            return res.status(403).json({ msg: error.message })
        }

            tarea.nombre = req.body.nombre || tarea.nombre,
            tarea.descripcion = req.body.descripcion || tarea.descripcion,
            tarea.estado = req.body.estado || tarea.estado,
            tarea.fechaEntrega = req.body.fechaEntrega || tarea.fechaEntrega,
            tarea.prioridad = req.body.prioridad || tarea.prioridad
            const tareaActualizada = await tarea.save();
            res.status(200).json({ tareaActualizada })
    } catch (error) {
        return res.status(403).json({ msg: error })
    }

}

const eliminarTarea = async (req, res) => {
    
    try {
        const { id } = req.params

        const tarea = await Tarea.findByIdAndDelete(id).populate('proyecto')
                                            

        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(403).json({ msg: error.message })
        }

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
            return res.status(403).json({ msg: error.message })
        }
           // await tarea.deleteOne()
           
            res.status(200).json({msg:"tarea eliminada correactamente", tarea })
    } catch (error) {
        return res.status(403).json({ msg: error })
    }




}

const cambiarEstadoTarea = async (req, res) => { 


    try {
        
        const { id } = req.params

        const tarea = await Tarea.findById(id);
                                            

        if (!tarea) {
            const error = new Error("Tarea no encontrada")
            return res.status(403).json({ msg: error.message })
        }

        if (tarea.proyecto.creador.toString() !== req.usuario._id.toString()) {
            const error = new Error("No puede acceder a esta tarea, solicitela a su creador")
            return res.status(403).json({ msg: error.message })
        }
          
        tarea.estado = true;
        const estadoTarea = await Tarea.findByIdAndUpdate({ new: true, estado:true});
        res.status(200).json({ estadoTarea })
    } catch (error) {
        return res.status(403).json({ msg: error })
    }


}

export {
    agregarTarea,
    obtenertarea,
    actualizartarea,
    eliminarTarea,
    cambiarEstadoTarea
}