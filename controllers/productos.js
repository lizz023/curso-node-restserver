const { response} = require("express");
const { Producto } = require("../models");


//obtenerCategorias - paginado - total categorias- populate (investigar moongose)
const obtenerProductos = async(req, res= response) => {
    
    const { limite = 5, desde = 0} = req.query;
    const query = {state:true};

    const [totalProductos, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .populate('usuario', 'name')
            .populate('categoria', 'name')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        totalProductos,
        productos
    });
}

//obtenerCategoria - populate {regresa el objeto de la categoria}
const obtenerProducto = async(req, res = response) => {

    const {id} =req.params;
    const producto = await Producto.findById(id)
        .populate('usuario', 'name')
        .populate('categoria', 'name');
    res.json(producto);
}

const crearProducto = async(req, res = response) => {

    //Lee el nombre que viene en el body
    const {estado, usuario,...body} = req.body;

    //Pregunta si existe una categoria con ese nombre
    const productoDB = await Producto.findOne({nombre: body.nombre})

    //Si existe se envia un error 
    if(productoDB){
        return res.status(400).json({
            msg:`la categoria ${productoDB.nombre}, ya existe`
        })
    }

    // Generar la data a guardar
    const data = {
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario: req.usuario._id
    }

    //Se crea una nueva categoria
    const producto = new Producto(data);

      //Guardar fisicamente en la base de datos
      await producto.save();

      res.status(201).json(producto);
}

// //actualizarCategoria
const actualizarProducto = async(req, res = response) => {
    
    const {id} = req.params;
    const {estado, usuario,...data} = req.body;

    if(data.nombre){
        data.nombre = data.nombre.toUpperCase()
    }

    //Pasa a mayuscula el nombre 
    data.usuario = req.usuario._id

    const producto = await Producto.findByIdAndUpdate(id, data, {new:true});
    res.json({
        producto
    });
}

//borrarCategoria - estado:false (requiere id)
const borrarProducto = async (req, res = response) => {

    const {id} = req.params;

    //Borrado físico
    //const usuario = await  Usuario.findByIdAndDelete(id);
    const productoBorrado = await  Producto.findByIdAndUpdate(id, {state:false}, {new:true});

    res.json(productoBorrado);
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    borrarProducto
}