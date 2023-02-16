const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar_campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { adminRole, tieneRole } = require('../middlewares/validar-roles');

const { esRolValido, existeEmail, existeusuariobyId } = require('../helpers/db-validators');
const { usuariosGet, 
        usuariosPost, 
        usuariosPut, 
        usuariosDelete, 
        usuariosPatch } 
= require('../controllers/usuarios');




const router = Router();

router.get('/', usuariosGet)
 
router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'El password no es válido, debe de contener más de 6 letras').isLength({min:6}),
    check('email', 'El email no es válido').isEmail(),
    check('email').custom(existeEmail),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPost)

router.put('/:id',[
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeusuariobyId),
    check('rol').custom(esRolValido),
    validarCampos
],usuariosPut )

router.patch('/', usuariosPatch)

router.delete('/:id', [
    validarJWT,
    //adminRole,
    tieneRole( 'VENTAS_ROL', 'USER_ROL', 'ADMIN_ROL'),
    check('id', 'No es un id válido').isMongoId(),
    check('id').custom(existeusuariobyId),
    validarCampos
],usuariosDelete)

module.exports = router;