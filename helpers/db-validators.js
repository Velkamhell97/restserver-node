const { User, Role, Category, Product } = require('../models');

/**
 * ---------------------ALL HELPERS----------------------------------------
 */

const validateCollection = (collection = '', validCollections = []) => {
  if(!validCollections.includes(collection)){
    throw new Error(`La coleccion ${collection} no esta permitida - colecciones permitidas: ${validCollections}`)
  }

  return true;
}

const validateQuerys = (querys = {}, validQuerys = []) => {

  const queryKeys = Object.keys(querys);

  if(queryKeys.length == 0) {
    throw new Error(`Debes enviar algun criterio de busqueda`);
  }

  const invalidQuerys = queryKeys.filter(key => !validQuerys.includes(key.toLocaleLowerCase()));
    
  if(invalidQuerys.length > 0){
    throw new Error(`La busqueda por ${invalidQuerys} no esta permitida - busquedas permitidas: ${validQuerys}`)
  }

  return true;
}

/**
 * ---------------------USERS HELPERS----------------------------------------
 */

const isValidRole = async(role = '') => {
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
    throw new Error(`El id: ${id} no existe en la base de datos`);
  } 
}

/**
 * ---------------------CATEGORIES HELPERS----------------------------------------
 */

const nameCategoryUpdate = async( name = '', {req}) => {
  const { id } = req.params;
  const category = await Category.findOne({name: name.toUpperCase()});
  if(category && category._id != id){
    throw new Error(`La categoria ${name} ya se encuentra registrada`)
  }
}

const existCategoryById = async(id) => {
  const category = await Category.findById(id);
  if(!category){
    throw new Error(`El id: ${id} no existe en la base de datos`);
  }
}

/**
 * ---------------------PRODUCTS HELPERS----------------------------------------
 */

 const nameProductsUpdate = async( name = '', {req}) => {
  const { id } = req.params;
  const product = await Product.findOne({name});
  if(product && product._id != id){
    throw new Error(`El producto ${name} ya se encuentra registrado`)
  }
}

const existProductById = async(id) => {
  const product = await Product.findById(id);
  if(!product){
    throw new Error(`El id: ${id} no existe en la base de datos`);
  }
}

module.exports = {
  validateCollection,
  validateQuerys,
  isValidRole,
  emailExist,
  existUserById,
  emailUpdate,
  nameCategoryUpdate,
  existCategoryById,
  nameProductsUpdate,
  existProductById
}