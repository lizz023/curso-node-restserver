const { Schema, model } = require('mongoose');

const UsuarioSchema = Schema ({
    name:{
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    email:{
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password:{
        type: String,
        required: [true, 'la contraseña es obligatoria']
    },
    img:{
        type: String,
    },
    rol:{
        type: String,
        required: true,
        enum: ['ADMIN_ROL', 'USER_ROL']
    },
    state:{
        type: Boolean,
        default: true
    },
    google:{
        type: Boolean,
        default: false
    },
});

//Quitar nombres para que no sean visibles en el postman
UsuarioSchema.methods.toJSON = function(){
    const {__v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model('Usuario', UsuarioSchema);