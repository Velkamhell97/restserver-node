const { request, response } = require("express");
const jwt = require('jsonwebtoken')

const User = require('../models/user');

const isValidJWT =async (req = request, res = response, next) => {
  const token = req.header('x-token');

  if(!token){
    return res.status(401).json({
      msg:'No hay token en la peticion'
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findById(uid);

    if(!user) {
      return res.status(401).json({
        msg:'Token no valido - usuario no existe en DB'
      })
    }

    if(!user.state) {
      return res.status(401).json({
        msg:'Token no valido - usuario con estado false'
      })
    }

    req.authUser = user;
    
    next();
  } catch (error) {
    //los console que imprimimos aqui tambien se almacenaran en un log en heroku
    console.log(error);
    return res.status(401).json({
      msg:'Token no valido'
    })
  }
  
}

module.exports = {
  isValidJWT
}