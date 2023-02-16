const { response, query } = require("express");
const {Categoria } = require('../models');


//obtenerCategorias - paginado - total categorias- populate (investigar moongose)
const obtenerCategorias = async(req, res= response) => {
    
    const { limite = 5, desde = 0} = req.query;
    const query = {state:true};

    const [totalCategorias, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .populate('usuario', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        totalCategorias,
        categorias
    });
}

//obtenerCategoria - populate {regresa el objeto de la categoria}
const obtenerCategoria = async(req, res = response) => {

    const {id} =req.params;
    const categoria = await Categoria.findById(id)
        .populate('usuario', 'name');
    res.json(categoria);
}

const crearCategoria = async(req, res = response) => {

    //Lee el nombre que viene en el body
    const nombre = req.body.nombre.toUpperCase();

    //Pregunta si existe una categoria con ese nombre
    const categoriaDB = await Categoria.findOne({nombre})

    //Si existe se envia un error 
    if(categoriaDB){
        return res.status(400).json({
            msg:`la categoria ${categoriaDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    //Se crea una nueva categoria
    const categoria = new Categoria(data);

      //Guardar fisicamente en la base de datos
      await categoria.save();

      res.status(201).json(categoria);
}

// //actualizarCategoria
const actualizarCategoria = async(req, res = response) => {
    
    const {id} = req.params;
    const {estado, usuario,...data} = req.body;

    //Pasa a mayuscula el nombre 
    data.nombre = data.nombre.toUpperCase()
    data.usuario = req.usuario._id

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new:true});
    res.json({
        categoria
    });
}

//borrarCategoria - estado:false (requiere id)
const borrarCategoria = async (req, res = response) => {

    const {id} = req.params

    //Borrado físico
    //const usuario = await  Usuario.findByIdAndDelete(id);
    const categoriaBorrada = await  Categoria.findByIdAndUpdate(id, {state:false}, {new:true});

    res.json({
        categoriaBorrada
    });
}




module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}