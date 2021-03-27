const { request, response } = require('express');

const { Product, Category } = require('../models');

const getProducts = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { state:true }

  const [total, products] = await Promise.all([
    Product.countDocuments(query),
    Product.find(query)
      .populate('user','name')
      .populate('category','name')
      .skip(Number(skip))
      .limit(Number(limit))
  ])

  res.json({
    msg:'GET PRODUCTS',
    total,
    products
  })
}

const getProductById = async (req = request, res = response) => {
  const { id } = req.params;

  const product = await Product.findById(id)
    .populate('user','name')
    .populate('category','name')

  if(!product.state){
    res.status(400).json({
      msg: 'El producto esta bloqueado'
    })
  }

  res.json({
    msg:'GET PRODUCT BY ID',
    product
  })
}

const createProduct = async (req = request, res = response) => {
  const { state, user, ...data} = req.body;

  const productDB = await Product.findOne({name:data.name});

  if(productDB){
    res.status(400).json({
      msg: `El producto ${data.name} ya existe` 
    });
  }

  data.user = req.authUser._id;
  data.user_name = req.authUser.name;

  try {
    const product = new Product(data);
    await product.save();

    res.status(201).json({
      msg:'Product Created',
      product
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error al crear el producto en la base de datos',
      error
    })
  }
}

const updateProduct = async (req = request, res = response) => {
  const { id } = req.params;

  const { state, user, ...data } = req.body;

  data.user = req.authUser._id;

  try {
    const product = await Product.findByIdAndUpdate(id, data, {new:true})

    res.json({
      msg:'UPDATE PRODUCT',
      product
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar el producto en la base de datos',
      error
    }) 
  }
}

const deleteProduct = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndUpdate(id, {state:false}, {new:true})

    res.json({
      msg:'DELETE PRODUCT',
      product
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error al eliminar el producto en la base de datos',
      error
    }) 
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
}