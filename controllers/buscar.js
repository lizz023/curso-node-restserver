const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Usuario, Categoria, Producto } = require("../models");


const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
];

const buscarUsuarios= async(termino = "", res = response) =>{

    const esMongoId = ObjectId.isValid(termino); //True

    if(esMongoId){
        const usuario = await Usuario.findById(termino);
        res.json({
            results: (usuario) ? [usuario] : []
        })
    }
    //Busqueda con expresion regular para flexibiliar la busqueda
    const regex = new RegExp(termino, 'i');

    const usuarios = await Usuario.find({
        $or:[{name: regex}, {email:regex}],
        $and: [{state: true}]
    });

    res.json({
        results: usuarios
    });
}

const buscarCategorias = async (termino = "", res = response) => {

    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const categoria = await Categoria.findById(termino);
        res.json({
            results: (categoria)? [categoria] : []
        })
    }
    //Flexibiliza la busqueda, permire aceptar minuscula y mayuscula
    const regex = new RegExp(termino, 'i');

    const categorias = await Categoria.find({nombre:regex, estado: true});
    res.json({
        results: categorias
    });
}

const buscarProductos =  async(termino = "", res = response) => {
    const esMongoId = ObjectId.isValid(termino);

    if(esMongoId){
        const producto = await Producto.findById(termino)
                            .populate('categoria', 'nombre');
        res.json({
            results: (producto)? [producto] : []
        })
    }
    //Flexibiliza la busqueda, permire aceptar minuscula y mayuscula
    const regex = new RegExp(termino, 'i');
    
    const productos = await Producto.find({nombre:regex})
                            .populate('categoria', 'nombre');
    res.json({
        results: productos
    });

}

const buscar = (req, res = response) =>{

    const {coleccion, termino} = req.params;

    if(!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }

    switch (coleccion) {
        case 'usuarios':
           buscarUsuarios(termino, res)
        break;

        case 'categorias':
            buscarCategorias(termino,res)
        break;

        case 'productos':
            buscarProductos(termino,res)
        break;

        default:
            res.status(500).json({
                msg:'Olvido hacer la busqueda'
            })
    }
    
}


module.exports = {
    buscar
}