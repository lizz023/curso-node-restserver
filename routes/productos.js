const { Router } = require('express');
const { check } = require('express-validator');

const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        borrarProducto} = require('../controllers/productos');

const { existeCategoriaById, existeProductoById } = require('../helpers/db-validators');


const { validarJWT } = require('../middlewares/validar-jwt');
const { adminRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar_campos');

const router = Router();


//router.get('http://localhost:8080/api/categorias')

//Obtener todas las categorias - publico
router.get('/', obtenerProductos)


//Obtener una categoria por id - publico
router.get('/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos,
], obtenerProducto );



//Crear categoria - privado - Cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('categoria', 'No es un id de mongo').isMongoId(),
    check('categoria').custom(existeCategoriaById),
    validarCampos
], crearProducto)

//Actualizar- privado- cualquier persona con token valido
router.put('/:id',[
    validarJWT,
    //check('categoria', 'No es un id de mongo').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], actualizarProducto)

//Eliminar categorias - Admin
router.delete('/:id',[
    validarJWT,
    adminRole,
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeProductoById),
    validarCampos
], borrarProducto)


module.exports = router;