const { Category, Product, User} = require('../models');
const { ObjectId } = require('mongoose').Types;

const capitalizeFirst = (name) => {
  if(!name) {
    return undefined;
  }

  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}

/**********************SINGLE********************/

const searchById = async (collection, id) => {
  const isMongoID = ObjectId.isValid(id);

  const query = {_id:id, state:true}

  let result = null;

  if(isMongoID){
    switch(collection){
      case "categories":
        result = await Category.findOne(query).populate('user','name');

        if(!result){
          throw new Error(`No existe una categoria con el id: ${id}`);
        }

        break;
      case "products":
        result = await Product.findOne(query).populate('category','name').populate('user','name');

        if(!result){
          throw new Error(`No existe un producto con el id: ${id}`);
        }

        break;
      case "users":
        result = await User.findOne(query);

        if(!result){
          throw new Error(`No existe un usuario con el id: ${id}`);
        }

        break;
    }

    return [result];
  }
}

/**
 * Search categories by ID or Name
 */

 const searchCategories = async (word = '') => {

  const categoryById = await searchById('categories',word);

  if(categoryById) {
    return categoryById;
  }

  const regex = new RegExp(word,'i');

  const categories = await Category.find({name:regex, state:true}).populate('user','name');

  return categories;
}

/**
 * Search Products by ID or Name (can add more options)
 */

 const searchProducts = async (word = '') => {

  const productById = await searchById('products',word);

  if(productById) {
    return productById;
  }

  const regex = new RegExp(word,'i');

  //podemos buscar por mas criterios
  const products = await Product.find({ 
    $or: [{ name:regex }],
    $and: [{state:true}]
  })
  .populate('category','name')
  .populate('user','name')

  return products;
}

/**
 * Search users by ID or Name or Email
 */

const searchUsers = async (word = '') => {

  const userById = await searchById('users',word);

  if(userById) {
    return userById;
  }

  const regex = new RegExp(word,'i');

  const users = await User.find({
    $or: [{ name:regex }, { email:regex }],
    $and: [{state:true}]
  });

  return users;
}

/**********************RELATIONSHIPS********************/

const searchCollectionRelations = async(collection, values) => {
  const query = Object.entries(values).map(value => ({[value[0]]:ObjectId(value[1])}));
  
  let results = null;

  //console.log(collection);

  switch(collection){
    case "categories":
      console.log('entre')
      results = await Category.find({$and:[...query,{state:true}]}).populate('user','name');
      break;
    case "products":
      results = await Product.find({$and:[...query,{state:true}]}).populate('category','name').populate('user','name');
      break;
  }
      
  if(!results){
    let error = '';

    Object.entries(values).map(value => {
      error += `${value[0]}(ID)=${value[1]}, `
    } );

    throw new Error(`No se encuentran ${collection} para los criterios ${error}, verifique los ids`);
  }

  return results;
}

/**
 * Search Products by Category and User
 */

 const searchProductsRelations = async (relations) => {

  const categoryDB = await (await Category.findOne({name:relations?.category?.toUpperCase(), state:true}))?.id;
  const userDB = await (await User.findOne({name:capitalizeFirst(relations.user), state:true}))?.id;

  const collectionsArray = [['category',categoryDB],['user',userDB]]
  const relationArray = collectionsArray.filter(group => !group.includes(undefined));

  if(relationArray.length == 0){

    try {
      const productsFilteredById = await searchCollectionRelations('products', {...relations});

      if(productsFilteredById){
        return productsFilteredById;
      }
    } catch (e) {
      let error = '';

      Object.entries(relations).map(value => {
        error += `${value[0]}(Name)=${value[1]}, `
      } );

      throw new Error(`No se encuentran productos para los criterios ${error}, verifique los nombres`);
    }
  }

  const relationNames = Object.fromEntries(relationArray);

  const productsFilteredByName = await searchCollectionRelations('products', {...relationNames});

  return productsFilteredByName;
}

/**
 * Search Categories by User
 */

 const searchCategoriesRelations = async (relations) => {

  const userDB = await (await User.findOne({name:capitalizeFirst(relations.user), state:true}))?.id;

  const collectionsArray = [['user',userDB]]
  const relationArray = collectionsArray.filter(group => !group.includes(undefined));

  if(relationArray.length == 0){
    try {
      const categoriesFilteredById = await searchCollectionRelations('categories', {...relations});

      if(categoriesFilteredById){
        return categoriesFilteredById;
      }
    } catch (e) {
      let error = '';

      Object.entries(relations).map(value => {
        error += `${value[0]}(Name)=${value[1]}, `
      } );

      throw new Error(`No se encuentran categorias para los criterios ${error}, verifique los nombres`);
    }
  }

  const relationNames = Object.fromEntries(relationArray);

  const categoriesFilteredByName = await searchCollectionRelations('categories', {...relationNames});

  return categoriesFilteredByName;
}

module.exports = {
  searchCategories,
  searchProducts,
  searchUsers,
  searchProductsRelations,
  searchCategoriesRelations
}