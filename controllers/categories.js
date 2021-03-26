const { request, response } = require('express');

const { Category } = require('../models');

const getCategories = async (req = request, res = response) => {
  const { limit = 5, skip = 0 } = req.query;
  const query = { state:true }

  //con el populate vemos la informacion del usuario que creo la categoria y no solo el id
  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query)
      .populate('user','name')
      .skip(Number(skip))
      .limit(Number(limit))
  ])

  res.json({
    msg:'GET CATEGORIES',
    total,
    categories
  })
}

const getCategoryById = async (req = request, res = response) => {
  const { id } = req.params;

  const category = await Category.findById(id).populate('user','name');

  if(!category.state){
    res.status(400).json({
      msg: 'La categoria esta bloqueada'
    })
  }

  res.json({
    msg:'GET CATEGORY BY ID',
    category
  })
}

const createCategory = async (req = request, res = response) => {
  const name = req.body.name.toUpperCase();

  const categoryDB = await Category.findOne({name});

  if(categoryDB){
    return res.status(400).json({
      msg: `La categoria ${categoryDB.name} ya existe` 
    });
  }

  const data = {
    name,
    user: req.authUser._id
  }

  try {
    const category = new Category(data);
    await category.save();

    res.status(201).json({
      msg:'Category Created',
      category
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error al crear la categoria en la base de datos',
      error
    })
  }
}

const updateCategory = async (req = request, res = response) => {
  const { id } = req.params;

  const data = {
    name: req.body.name.toUpperCase(),
    user: req.authUser._id
  }

  try {
    const category = await Category.findByIdAndUpdate(id,data,{new:true})

    res.json({
      msg:'UPDATE CATEGORY',
      category
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error al actualizar la categoria en la base de datos',
      error
    }) 
  }
}

const deleteCategory = async (req = request, res = response) => {
  const { id } = req.params;

  try {
    const category = await Category.findByIdAndUpdate(id,{state:false},{new:true})

    res.json({
      msg:'DELETE CATEGORY',
      category
    })
  } catch (error) {
    res.status(500).json({
      msg: 'Error al eliminar la categoria en la base de datos',
      error
    }) 
  }
}

module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}