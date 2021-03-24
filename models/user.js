const { Schema, model } = require('mongoose');

const userSchema = Schema({
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
    required: [true, 'La contraseña es obligatoria'],
  },
  img: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'El rol es requerido'],
    default: 'USER_ROLE'
    //enum: ['ADMIN_ROLE', 'USER_ROLE']
  },
  state: {
    type: Boolean,
    default: true
  },
  google: {
    type: Boolean,
    default: false
  }
})

//Recordar usar una funcion normal en estos metodos en vez de una funcion de flecha
userSchema.methods.toJSON = function() {
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

module.exports = model('User', userSchema);