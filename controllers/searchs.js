const { request, response } = require('express');

const { 
  searchCategories,
  searchProducts,
  searchUsers,
  searchProductsRelations,
  searchCategoriesRelations  
} = require('../helpers/db-searchs');

const search = async(req = request, res = response) => {
  const { collection, word } = req.params;

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

  switch(collection) {
    case 'categories':
      try {
        console.log('categories')
        const categories = await searchCategoriesRelations(req.query);

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
        const products = await searchProductsRelations(req.query);

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