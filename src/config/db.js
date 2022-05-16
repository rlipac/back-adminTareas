import mongoose from 'mongoose'

const conexionDB = async ()=>{
    try{
     const  connection = await mongoose.connect(process.env.URL_DB_LOCAL,{
         useNewUrlParser: true,
         useUnifiedTopology: true
     });

     const url = `${connection.connection.host}: ${connection.connection.port}`;
     console.log('my url => ', url)

    }catch(error){
        console.log(`error >= ${error.message} ==> NO SE CONECTO`);
        process.exit(1)
    }
}

export default conexionDB;