const { response, json } = require("express");
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async(req, res = response) => {

    const {email,password} =req.body;

    try {

        //Verificar si el email existe
        const usuario = await Usuario.findOne({email})
        if(!usuario ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - email'
            });
        }
        //Si el usuario esta activo
        if( !usuario.state ){
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - state:false'
            });
        }

        //Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if ( !validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - password'
            });
        }
        //Generar el JWT
        const token = await generarJWT( usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const googleSingIn = async(req, res = response) =>{

    const {id_token} = req.body;

    try{

        const {correo, nombre, img} = await googleVerify(id_token)

        let usuario = await Usuario.findOne({id_token})

        if(!usuario){
            //Si el usuario no existe, hay que crearlo
            const data= {
                nombre,
                correo,
                password: '',
                img,
                google: true,
            };

            usuario = new Usuario( data );
            await usuario.save();
        }

        // Si el usuario en base de datos
        if(!usuario.state){
           return res.status(400).json({
                msg: 'Usuario bloqueado'
            })
        }

        //Generar el JWT
        const token = await generarJWT( usuario.id);
         
        res.json({
            usuario,
            token
        })

    } catch (error) {
        json.status(400).json({
            ok:false,
            msg:'El token no se pudo verificar'
        })
    }
    
}
module.exports = {
    login,
    googleSingIn
} 