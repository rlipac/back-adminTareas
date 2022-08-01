
import Proyecto from "../models/Proyectos.js";
import Tarea from "../models/Tarea.js";
import Usuario  from "../models/Usuario.js";

const listarProyectosPorUsuario = async(req, res)=>{
    console.log('listarProyectosPorUsuario...')
     try {
        const proyectos = await Proyecto.find({
                                            $or:[
                                                { colaboradores: { $in: req.usuario }},
                                                { creador: { $in: req.usuario } },
                                            ]
                                        })
                                        .populate('creador', 'nombre email')
                                        .select('-tareas')
        if(proyectos == ''){
            return res.status(203).json({ msg: `Tu lista de proyectos esta vacia ${proyectos}`})
        }
        //contar Usuarios
             let arrayProyectos =[];
             for(let proyecto in proyectos){
                 arrayProyectos.push(proyecto)
             }
             const totalProyectos = arrayProyectos.length;
        //fin contar categorias  
         res.json({
             totalProyectos,
             proyectos
            })
           
     } catch (error) {
        return res.status(403).json({ msg: `${error}`})
     }

}
const nuevoProyecto = async(req, res)=>{

   

   try {
        const { nombre } = req.body;
      //  console.log(req.usuario)

        const proyectoExiste= await Proyecto.findOne({ nombre: nombre })

        if(proyectoExiste){
            return res.json({ msg: "El Proyecto ya existe"})
        }

        const proyecto = new Proyecto(req.body) // guardamos proyecto lo que se manda por el formulario
        proyecto.creador = req.usuario._id;
        const proyectoAlmacenado = await proyecto.save()
        
        // console.log(proyectoAlmacenado)
        res.json(proyectoAlmacenado)
        
   } catch (error) {
     return res.status(403).json({ msg :`${error}`})
   }

}
const obtenerProyectoYtareas = async(req, res)=>{

    console.log('obtener pproyecto ... ')

    try {   
      ///  console.log(req.usuario, '??',  req.params.id)
            
            const { id } = req.params
            const proyecto = await Proyecto.findById(id)
                                           .populate({ path: "tareas", select: '-__v -updatedAt',
                                                       populate: { path: "completado", select: "nombre email"}  // hacer populate  un elemento populate
                                                    })
                                           .populate('colaboradores', 'email nombre')
                                           .select('-__v -createdAt -updatedAt')
            const idCreador = proyecto.creador._id.toString();
            const idUsuario = req.usuario._id.toString();
            const idColaborador = proyecto.colaboradores;
           // console.log('idColaborador --> ',idColaborador);
          
            //const idColaborador = proyecto.colaboradores.colaborador._id.toString()
           // console.log('proyecto -> ', proyecto, 'idCreador: ',idCreador, 'idUsuario', idUsuario, 'idColaborador --> ',idColaborador); //, 'id colaborador-->', idColaborador )
            if(!proyecto){   // verificando si existe proyecto
                console.log('proyecto no existe')
                const error = new Error("Proyecto no encontrado")
                return res.status(404).json({ msg: error.message})
                     
            }

             // No puede ver el proyecto si
           //? no es el creador del proyecto
           //? y Si  no es colaborador 
            if( idCreador !== idUsuario && !proyecto.colaboradores.some(colaborador => 
                colaborador._id.toString() === req.usuario._id.toString()) ){   // solo modifica si el lo creo
               
                return res.status(403).json({
                    msg: 'accion no valida',
                    
                    })   

            }
            if(proyecto.tareas.length == 0){
               
             return res.status(201).json({  msg:`Todavia no tines tareas`, proyecto})
            }

            res.json({
                proyecto,
                
            })
           
           
    } catch (error) {
        return res.status(403).json({ msg:`${error}`})
    }



   

}
const editarProyecto = async(req, res)=>{
    console.log(' Editar proyecto...lipa')
    try{
        const { id } = req.params
      //  console.log(req.params)
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
       
        //const proyectoActualizado = await Proyecto.findByIdAndUpdate(id, proyecto,  { new: true});
        
        const proyectoActualizado = await proyecto.save()
        res.status(200).json({ proyectoActualizado })
        

}catch(error){
    return res.status(403).json({ msg: error})
}



}
const deleteProyectoCreadoPorUsuario = async(req, res)=>{
    console.log(' Eliminar proyecto...')
   
    try {
        const { id } = req.params

        const proyectoEliminado = await Proyecto.findById(id)
        const idProyecto = proyectoEliminado.creador.toString();
        const usuarioId =  req.usuario._id.toString();
        if(!proyectoEliminado){   // verificando si existe proyecto
          
            const error = new Error("Proyecto no encontrado")
            return res.status(404).json({ msg: error.message})
        }
        if( idProyecto !== usuarioId ){   // solo modifica si el lo creo
            const error = new Error("Accion no valida ")
            return res.status(403).json({ msg: error.message})
    
        }

        await proyectoEliminado.deleteOne()
        res.status(200).json({ mgs:" proyecto eliminado", proyectoEliminado })
        
    } catch (error) {
        return res.status(403).json({ msg: error})
    }


}

const obtenerProyectoId = async(req, res)=>{
    console.log(' Editar proyectoId populate colaboradores...')

    try {
        const { id } = req.params
        const proyecto = await Proyecto.findById(id)
                                       .populate('creador', 'nombre email')
                                       // rellena los datos del creador 
        if(!proyecto){   // verificando si existe proyecto
          
            const error = new Error("Proyecto no encontrado")
            return res.status(404).json({ msg: error.message})
        }
        // console.log(proyecto)
        res.status(200).json( proyecto )
        
    } catch (error) {
            console.log(error.message)
    }

  

} 


// colaborador
const searchColaborador= async(req, res)=>{
   
    try {
        const usuario = await Usuario.findOne({email: req.body.email}).select('-__v -confirmado -createdAt -updatedAt -token -password')
        if(!usuario){
            console.log('No existe usuario')
            return  res.status(400).json({msg:'users no existe'})
            
          
        }
        console.log('searchColaborador-->',usuario)
        return  res.status(200).json(usuario)
   
    } catch (error) {
        console.log(error)
    }
    res.end()
   
}

const addColaborador = async (req, res)=>{
    // console.log('agergarColaborador.. ', req.params.id, 'mi id')
    // console.log('agergarColaborador -> Usuario.. ', req.usuario)
  //  console.log('agergarColaborador -> colaborador..-> ', req.body.email)

 try {  
        const emailColaborador = req.body.email; 
        const idUsuario = req.usuario.id.toString();
        const { id }= req.params;
        // bu8scamos proyecto
        const proyecto = await Proyecto.findById(id);

        if(!proyecto){
            return res.status(400).json({
                msg:'Proyecto no exite'
            })     
        }
        // convertimos a strign los nid para compararlos
        // verificamos que el solo el creador del proyecot pueda agregar colavboradores
        const idCreador = proyecto.creador.toString()
        if(idUsuario !== idCreador){
            
            return  res.status(400).json({msg:'Solo el creador del Proyecto puede agregar colaboradores'})
        }
        // buscamos colaborador
        const colaborador = await Usuario.findOne({email: emailColaborador}).select('-__v -token -password -confirmado -createdAt -updatedAt');
       // console.log('son coalbodador encotntrado -->', colaborador)
        if(!colaborador){
            return res.status(400).json({
                msg:'Este usuario no exite'
            })   
            
        }
        const idColaborador = colaborador._id.toString();//convertimos a string  para compara
        if(idCreador === idColaborador){
          return  res.status(400).json({msg:'El Creaodr del proyecto no puede ser colaborador'}, idCreador, idColaborador);
        }
        // buscamos si ya existe el colaborador en el proyecto
       
        if(proyecto.colaboradores.includes(colaborador._id)){
            return  res.status(400).json({msg:'colaborador ya pertenece a este proyecto'})   
        }
        // incluimos el colaborador al array caolaboradores del Proyecto
        proyecto.colaboradores.push(colaborador._id);
        // guardamos el proyecto
         await proyecto.save()
       res.status(200).json({ proyecto })

 } catch (error) {
    console.log(error)
 }


}
const eliminarColaborador = async (req, res)=>{
     console.log('deltecolaborador--> ', );
    
        try {

        const { id } = req.params;
        const  {idColaborador} = req.body;
        
        const idUsuario = req.usuario.id.toString();
            // bu8scamos proyecto
            const proyecto = await Proyecto.findById(id);

            if(!proyecto){
                return res.status(400).json({
                    msg:'Proyecto no exite'
                })     
            }
            // convertimos a strign los nid para compararlos
            // verificamos que el solo el creador del proyecot pueda agregar colavboradores
            const idCreador = proyecto.creador.toString()
            if(idUsuario !== idCreador){
                
                return  res.status(400).json({msg:'Solo el creador del Proyecto puede Eliminar al colaboradores'})
            }
        
            // incluimos el colaborador al array caolaboradores del Proyecto
            proyecto.colaboradores.pull(idColaborador);
            // guardamos el proyecto
            await proyecto.save()
        res.status(200).json({ proyecto })

        } catch (error) {
            console.log(error)

        }

}




 export {
 
     listarProyectosPorUsuario,
     obtenerProyectoId,
     nuevoProyecto,
     obtenerProyectoYtareas,
     editarProyecto,
     deleteProyectoCreadoPorUsuario,
     addColaborador,
     eliminarColaborador,
     searchColaborador
 }