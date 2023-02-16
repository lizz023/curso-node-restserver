const { Router } = require('express');
const { check } = require('express-validator');

const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        borrarCategoria} = require('../controllers/categorias');

const { existeCategoriaById } = require('../helpers/db-validators');


const { validarJWT } = require('../middlewares/validar-jwt');
const { adminRole } = require('../middlewares/validar-roles');
const { validarCampos } = require('../middlewares/validar_campos');

const router = Router();


//router.get('http://localhost:8080/api/categorias')

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias)


//Obtener una categoria por id - publico
router.get('/:id', [
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos,
], obtenerCategoria );



//Crear categoria - privado - Cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria)

//Actualizar- privado- cualquier persona con token valido
router.put('/:id',[
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaById),
    validarCampos
], actualizarCategoria)

//Eliminar categorias - Admin
router.delete('/:id',[
    validarJWT,
    adminRole,
    check('id','No es un id de Mongo válido').isMongoId(),
    check('id').custom(existeCategoriaById),
    validarCampos
], borrarCategoria)


module.exports = router;