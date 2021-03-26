const { Category, Product, User} = require('../models');
const { ObjectId } = require('mongoose').Types;

/**
 * Search categories by ID or Name
 */

 const searchCategories = async (word = '') => {

  const isMongoID = ObjectId.isValid(word);

  if(isMongoID) {
    const category = await Category.findOne({_id:word, state:true})
    .populate('user','name');

    if(!category){
      throw new Error(`No existe una categoria con el id: ${word}`);
    }
    
    return [category];
  }

  const regex = new RegExp(word,'i');

  const categories = await Category.find({name:regex, state:true}).populate('user','name');

  return categories;
}

/**
 * Search Products by ID or Name (can add more options)
 */

 const searchProducts = async (word = '') => {

  const isMongoID = ObjectId.isValid(word);

  if(isMongoID) {
    const product = await Product.findOne({_id:word, state:true})
    .populate('category','name')
    .populate('user','name');

    if(!product){
      throw new Error(`No existe un producto con el id: ${word}`);
    }

    return [product];
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

  const isMongoID = ObjectId.isValid(word);

  if(isMongoID) {
    const user = await User.findOne({_id:word, state:true});

    if(!user){
      throw new Error(`No existe un usuario con el id: ${word}`);
    }

    return [user];
  }

  const regex = new RegExp(word,'i');

  const users = await User.find({
    $or: [{ name:regex }, { email:regex }],
    $and: [{state:true}]
  });

  return users;
}

/**********************RELATIONSHIPS********************/

const getCategory = async (query) => {
  let dbQuery = {...query};

  if(query.name){
    dbQuery = {name: query.name.toUpperCase()};
  }

  const category = await Category.findOne(dbQuery);

  if(!category){
    const error = query._id
      ? `No existe una categoria con el id: ${query._id}`
      : `No existe una categoria llamada: ${query.name}`

    throw new Error(error);
  }

  return category;
}

const getUser = async (query) => {
  let dbQuery = {...query};

  if(query.name){
    const regex = new RegExp("^" + query.name.toLowerCase(), "i");
    dbQuery = {name: regex};
  }

  const user = await User.findOne(dbQuery);

  if(!user){
    const error = query._id
      ? `No existe un usuario con el id: ${query._id}`
      : `No existe un usuario llamado: ${query.name}`

    throw new Error(error);
  }

  return user;
}

/**
 * Search Products by Category and User
 */

 const searchProductsRelations = async (category, user) => {

  const isCategoryMongoID = ObjectId.isValid(category);
  const isUserMongoID = ObjectId.isValid(user);

  if(category && user){

    if(isCategoryMongoID && isUserMongoID) {
      const categoryDB = await getCategory({_id:category, state:true});
      const userDB = await getUser({_id:user, state:true});

      const productsByCategoryAndUser = await Product.find({
        $and: [{category:ObjectId(category)}, {user:ObjectId(user)}, {state:true}]
      })
      .populate('category','name')
      .populate('user','name');

      return productsByCategoryAndUser;
    }

    const categoryDB = await getCategory({name:category, state:true});
    const userDB = await getUser({name:user, state:true});

    const productsByCategoryAndUser = await Product.find({
      $and: [{category:ObjectId(categoryDB._id)}, {user:ObjectId(userDB._id)}, {state:true}]
    })
    .populate('category','name')
    .populate('user','name');

    return productsByCategoryAndUser;

  } else if(category) {

    if(isCategoryMongoID) {
      const categoryDB = await getCategory({_id:category, state:true});

      const productsByCategory = await Product.find({
        category:ObjectId(category), state:true
      })
      .populate('category','name')
      .populate('user','name');

      return productsByCategory;
    }
  
    const categoryDB = await getCategory({name:category, state:true});

    const productsByCategory = await Product.find({
      category:categoryDB._id, state:true
    })
    .populate('category','name')
    .populate('user','name');

    return productsByCategory;

  } else if(user){
    if(isUserMongoID) {
      const userDB = await getUser({_id:user, state:true});

      const productsByUser = await Product.find({
        user:ObjectId(user), state:true
      })
      .populate('category','name')
      .populate('user','name');
      
      return productsByUser;
    }

    const userDB = await getUser({name:user, state:true});
  
    const productsByUser = await Product.find({
      user:userDB._id, state:true
    }) 
    .populate('category','name')
    .populate('user','name');

    return productsByUser;
  }
}

const searchCategoriesRelations = async (user) => {

  const isUserMongoID = ObjectId.isValid(user);

  if(isUserMongoID) {
    const userDB = await getUser({_id:user, state:true});

    const categoriesByUser = await Category.find({
      user:ObjectId(user), state:true
    })
    .populate('user','name');
    
    return categoriesByUser;
  }

  const userDB = await getUser({name:user, state:true});

  const categoriesByUser = await Category.find({
    user:userDB._id, state:true
  }) 
  .populate('user','name');

  return categoriesByUser;
}

module.exports = {
  searchCategories,
  searchProducts,
  searchUsers,
  searchProductsRelations,
  searchCategoriesRelations
}