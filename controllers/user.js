const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user');

const getUser = async (req = request, res = response) => {
  //res.send('Hello World!');
  //Con la destructuracion podemos definir valores por defecto
  //const {q, nombre = "No name", apikey, page = 1, limit = 10}= req.query;

  // res.json({
  //   msg: 'GET API REQUEST FROM CONTROLLER',
  //   q,
  //   nombre,
  //   apikey,
  //   page,
  //   limit
  // })

  const { limit = 5, desde = 0 } = req.query; 
  const query = { state:true }

  //todo validacion de que el limite y desde sea un numero y no un texto
  // const users = await User.find(query)
  //   .skip(Number(desde))  
  //   .limit(Number(limit));

  //const total = await User.countDocuments(query);

  //Mas rapidas se ejecutan en paralelo
  const [total, users] = await Promise.all([
    User.countDocuments(query),
    User.find(query).skip(Number(desde)).limit(Number(limit))
  ])

  res.json({
    msg: 'GET API REQUEST FROM CONTROLLER',
    total,
    count: users.length,
    users
  })
}

const postUser = async(req = request, res = response) => {
  //res.send('Hello World!');
  //Se puede hacer destructuring para recibir unicamente la informacion que yo necesito
  const { name, email, password, role } = req.body;
  const user = new User({name, email, password, role});

  //encriptacion
  //es el numero de iteraciones (vueltas) que deben hacerse para encriptar la contraseña entre mas alta mas segura
  //pero mas tiempo tarda generandola
  const salt = bcryptjs.genSaltSync(10);
  user.password = bcryptjs.hashSync(password, salt);

  try {
    await user.save();

    return res.json({
      msg: 'User saved successfully',
      user
    });
  } catch (error){
    return res.status(500).json({
      msg: 'No se pudo grabar el usuario en la base de datos',
      error
    });
  }
  // res.json({
  //   msg: 'POST API REQUEST FROM CONTROLLER',
  //   ...body
  // });
}

const putUser = async (req = request, res = response) => {
  //res.send('Hello World!');
  const { id }= req.params;
  //se debe evitar recibir alguna variable _id que entre en conflicto con el _id de la base de datos
  const { _id, password, google, ...rest } = req.body;

  if(password) {
    const salt = bcryptjs.genSaltSync(10);
    rest.password = bcryptjs.hashSync(password, salt);
  }

  //const user = await User.findByIdAndUpdate(id, rest, {new: true, context: 'query'}, function (error, model) {
  const user = await User.findByIdAndUpdate(id, rest, {new: true}, (error, model) => {
    if(error) {
      return res.status(500).json({
        msg: 'No se pudo actualizar el usuario en la base de datos',
        error
      })
    }
    res.json({
      msg: 'PUT API REQUEST FROM CONTROLLER',
      user: model.toJSON()
    })
  });

}

const deleteUser = async (req = request, res = response) => {
  //res.send('Hello World!');
  const { id } = req.params;
  const authUser = req.authUser;

  //Si imprimimos el usuario por consola no se le apliacara la funcion toJSON()
  //console.log(authUser);
  //fisicamente
  //const user = await User.findByIdAndDelete(id);

  //const authenticatedUser = 

  //logicamente
  const user = await User.findByIdAndUpdate(id, {state:false}, {new:true}, (error, model) => {
    if(error) {
      return res.status(500).json({
        msg: 'No se pudo eliminar el usuario en la base de datos',
        error
      })
    }
    res.json({
      msg: 'DELETE API REQUEST FROM CONTROLLER',
      user: model.toJSON(),
      authUser
    })
  });
}

module.exports = {
  getUser,
  postUser,
  putUser,
  deleteUser
}