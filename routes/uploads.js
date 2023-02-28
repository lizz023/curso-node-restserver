const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');
const { coleccionesPermitidas } = require('../helpers');

const { validarCampos } = require('../middlewares/validar_campos');
const{ validarArchivoSubir } = require('../middlewares/validar-archivo');


const router = Router();

//Crea algo nuevo
router.post('/',validarArchivoSubir, cargarArchivo)

//Actualizar 
router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios', 'productos'])),
    validarCampos
], actualizarImagenCloudinary)
//], actualizarImagen)

//Mostrar imagene
router.get('/:coleccion/:id',[
    check('id', 'El id debe ser de mongo').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c,['usuarios', 'productos'])),
    validarCampos
], mostrarImagen)
 
module.exports = router;
 