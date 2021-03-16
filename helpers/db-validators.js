const User = require('../models/user');
const Role = require('../models/role');

const isValidRole = async(role = '') => {
  //console.log(await Role.find({}));-> muestra todos los registros
  const roleExist = await Role.findOne({role});
  if(!roleExist){
    throw new Error(`El rol ${role} no esta registrado en la base de datos`);
  } 
} 

const emailExist = async(email = '') =>{
  const user = await User.findOne({email});
  if(user){
    throw new Error(`El email ${email} ya esta registrado`);
  } 
}

const emailUpdate = async(email = '', {req}) => {
  const { id } = req.params;
  const user = await User.findOne({email});
  if(user && user._id != id){
    throw new Error(`El email ${email} ya esta registrado`);
  }
}

const existUserById = async(id) => {
  const user = await User.findById(id);
  if(!user){
    throw new Error(`El id: ${id} no existe`);
  } 
}

module.exports = {
  isValidRole,
  emailExist,
  existUserById,
  emailUpdate
}