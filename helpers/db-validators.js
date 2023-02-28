const { Categoria, Producto } = require('../models');
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

 //Categorias
const existeCategoriaById = async(id)=>{
    const existeCategoria = await Categoria.findById(id);
    if( !existeCategoria){
        throw new Error(`El id: ${id} no existe`);
    }
}
 
//Productos
const existeProductoById = async(id)=>{
    const existeProducto = await Producto.findById(id);
    if( !existeProducto){
        throw new Error(`El id: ${id} no existe`);
    }
}

//Valida colecciones
const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);
    if(!incluida){
        throw new Error(`La coleccion ${coleccion} no es permitida. Las colecciones permitidas son ${colecciones }`)
    }

    return true;
}


module.exports = {
    esRolValido,
    existeEmail,
    existeusuariobyId,
    existeCategoriaById,
    existeProductoById,
    coleccionesPermitidas
}