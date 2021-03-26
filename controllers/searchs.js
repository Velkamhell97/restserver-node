const { request, response } = require('express');

const { 
  searchCategories,
  searchProducts,
  searchUsers,
  searchProductsRelations,
  searchCategoriesRelations  
} = require('../helpers/db-searchs');

const allowedCollections = [
  'categories',
  'products',
  'roles',
  'users',
]

const allowedQuerys = [
  'category',
  'product',
  'rol',
  'user',
]

const search = async(req = request, res = response) => {
  const { collection, word } = req.params;

  if(!allowedCollections.includes(collection)){
    return res.status(400).json({
      msg: `La coleccion ${collection} no esta permitida - colecciones permitidas: ${allowedCollections}`
    })
  }

  switch(collection) {
    case 'categories':
      try {
        const categories = await searchCategories(word);

        res.json({
          count: categories.length,
          results: categories
        });
      } catch (error) {
        res.status(400).json({
          msg: error.message
        })
      } finally {
        break;
      }      
    case 'products':
      try {
        const products = await searchProducts(word);

        res.json({
          count: products.length,
          results: products
        })
      } catch (error) {
        res.status(400).json({
          msg: error.message
        })
      } finally {
        break;
      }
    case 'users':
      try {
        const users = await searchUsers(word);

        res.json({
          count: users.length,
          results: users
        })
      } catch (error) {
        res.status(400).json({
          msg: error.message
        })
      } finally {
        break;
      }
    default:
      res.status(500).json({
        msg:'Se me olvido hacer esta busqueda'
      })
  }   
}

const searchRelation = async(req = request, res = response) => {
  const { collection } = req.params;
  const { category, user, ...others }= req.query;
  const invalidQuerys = Object.keys(others);

  if(Object.keys(req.query).length == 0){
    return res.status(400).json({
      msg:'Debes enviar algun criterio de busqueda'
    })
  }

  if(!allowedCollections.includes(collection)){
    return res.status(400).json({
      msg: `La coleccion ${collection} no esta permitida - colecciones permitidas: ${allowedCollections}`
    })
  }

  if(invalidQuerys.length > 0){
    return res.status(400).json({
      msg: `La busqueda por ${invalidQuerys} no esta permitida - busquedas permitidas: ${allowedQuerys}`
    })
  }

  switch(collection) {
    case 'categories':
      try {
        const categories = await searchCategoriesRelations(user);

        res.json({
          count: categories.length,
          result: categories
        })
      } catch (error) {
        res.json({
          msg: error.message
        })
      } finally {
        break;
      }
    case 'products':
      try {
        const products = await searchProductsRelations(category, user);

        res.json({
          count: products.length,
          result: products
        })
      } catch (error) {
        res.json({
          msg: error.message
        })
      } finally {
        break;
      }
    default:
      res.status(500).json({
        msg:'Se me olvido hacer esta busqueda'
      })
  }   
}

module.exports = {
  search,
  searchRelation
}