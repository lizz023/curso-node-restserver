const { Router } = require('express');
const { check } = require('express-validator');

const { login, googleSingIn } = require('../controllers/auth');

const { validarCampos } = require('../middlewares/validar_campos');


const router = Router();

router.post('/login',[
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),
    validarCampos
], login)

router.post('/google',[
    check('id_token', 'id_token es necesario').not().isEmpty(),
    validarCampos
], googleSingIn)

module.exports = router;
 