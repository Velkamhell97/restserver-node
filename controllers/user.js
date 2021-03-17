const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const getUser = async (req = request, res = response) => {
  const { limit = 5, desde = 0 } = req.query; 
  const query = { state:true }

  //Mas rapidas se ejecutan en paralelo
  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(desde)).limit(Number(limit))
  ])

  res.json({
    msg: 'Users get successfully',
    total,
    count: users.length,
    users
  })
}

const postUser = async(req = request, res = response) => {
  //Con el destructuring se pueden recibir unicamente los parametros que queremos
  const { name, email, password, role } = req.body;
  const user = new User({name, email, password, role});

  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync(password, salt);

  try {
    await user.save();

    return res.json({
      msg: 'User saved successfully',
      user
    });
  } catch (error){
    console.log(error);

    return res.status(500).json({
      msg: 'No se pudo grabar el usuario en la base de datos',
      error
    });
  }
}

const putUser = async (req = request, res = response) => {
  //El resto del objeto es tambien utilizado para descartar valores
  const { _id, password, google, ...rest } = req.body;
  const { id }= req.params;

  if(password) {
    const salt = bcryptjs.genSaltSync(10);
    rest.password = bcryptjs.hashSync(password, salt);
  }

  //Tener en cuenta las opciones: {new: true, context: 'query'}
  try {
    const user = await User.findByIdAndUpdate(id, rest, {new: true});
      
    res.json({
      msg: 'User update successfully',
      user
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'No se pudo actualizar el usuario en la base de datos',
      error
    })
  }
}

const deleteUser = async (req = request, res = response) => {
  const { id } = req.params;

  //Borrar fisicamente
  //const user = await User.findByIdAndDelete(id);

  //Borrar logicamente
  try {
    const user = await User.findByIdAndUpdate(id, {state:false}, {new:true});

    res.json({
      msg: 'User delete successfully',
      user
    })
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      msg: 'No se pudo eliminar el usuario en la base de datos',
      error
    })
  }
}

module.exports = {
  getUser,
  postUser,
  putUser,
  deleteUser
}