const { response, request } = require('express');

const getUser = (req = request, res = response) => {
  //res.send('Hello World!');
  //Con la destructuracion podemos definir valores por defecto
  const {q, nombre = "No name", apikey, page = 1, limit = 10}= req.query;

  res.json({
    msg: 'GET API REQUEST FROM CONTROLLER',
    q,
    nombre,
    apikey,
    page,
    limit
  })
}

const postUser = (req = request, res = response) => {
  //res.send('Hello World!');
  //Se puede hacer destructuring para recibir unicamente la informacion que yo necesito
  const body = req.body;

  res.json({
    msg: 'POST API REQUEST FROM CONTROLLER',
    ...body
  });
}

const putUser = (req = request, res = response) => {
  //res.send('Hello World!');
  const id = req.params.id;

  res.json({
    msg: 'PUT API REQUEST FROM CONTROLLER',
    id : id
  })
}

const deleteUser = (req = request, res = response) => {
  //res.send('Hello World!');
  const id = req.params.id;

  res.json({
    msg: 'PUT API REQUEST FROM CONTROLLER',
    id : id
  })
}

module.exports = {
  getUser,
  postUser,
  putUser,
  deleteUser
}