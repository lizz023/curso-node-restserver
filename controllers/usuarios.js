const {response, request} = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');




const usuariosGet = async(req = request, res = response) => {

   const { limite = 5, desde = 0} = req.query;

   //Promise.all() Permite mandar una arreglo 
   //con todas las promesas que quiero que se ejecuten

    const [totalRegistros, usuarios] = await Promise.all([
        Usuario.countDocuments({state:true}),
        Usuario.find({state:true})
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        totalRegistros,
        usuarios
    });
}

const usuariosPost = async(req, res = response) => {

    const {name, email, password, rol} = req.body;
    const usuario = new Usuario( {name, email, password, rol} );

    //Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password,salt);

    //Guardar registro en base de datos (mongoose)
    await usuario.save();

    res.json({
        msg: 'post API',
        usuario
    });
}

//Actualizar información
const usuariosPut = async(req, res = response) => {
    
    const {id} = req.params;
   const {password, google, email, ...resto} = req.body;


    //Validar contra base de datos
    if(password){
        //Encriptar la contraseña
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password,salt);
    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);
    res.json({
        usuario
    });
}

const usuariosPatch = (req, res = response) => {
    
    res.json({
        msg: 'patch API',
        usuario
    });
}

const usuariosDelete = async (req, res = response) => {

    const {id} = req.params

    //Borrado físico
    //const usuario = await  Usuario.findByIdAndDelete(id);
    const usuario = await  Usuario.findByIdAndUpdate(id, {state:false});

   

    
    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}