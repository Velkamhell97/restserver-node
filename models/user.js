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

//una funcion flecha no utiliza el objeto this como la referencia actual para estos casos se utiliza el function
userSchema.methods.toJSON = function() {
  //Esto genera la instanacia creada pero con sus propiedades como si fuera un objeto de javascript
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id;
  return user;
}

module.exports = model('User', userSchema);