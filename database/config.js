const mongoose = require('mongoose');


const dbConection = async() =>{
    //Conexion a base de datos donde no se tiene el control absoluto
    try {
        
        await mongoose.connect(process.env.MONGODB_CONX);

        console.log('base de datos online');
    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de inicializar la base de datos');
    }
}

module.exports = {
    dbConection
}