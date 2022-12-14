const Role = require('../models/role');
const Usuario = require('../models/usuario');

const esRolValido = async(rol = '') => {
    const existeRol = await Role.findOne({rol});
    if (!existeRol){
        throw new Error(`El rol ${rol} no esta registrado en la base de datos `);
    }
}

//Verificar si el correo existe
const existeEmail = async(email = '') => {

   const existeEmail = await Usuario.findOne({email});
    if ( existeEmail ){
        throw new Error(`El email: ${email} ya esta registrado `);
    }
}

//Verificar si el id existe
const existeusuariobyId = async(id = '') => {

    const existebyId = await Usuario.findById(id);
     if ( !existebyId ){
         throw new Error(`El id: ${id} no existe `);
     }
 }

module.exports = {
    esRolValido,
    existeEmail,
    existeusuariobyId
}