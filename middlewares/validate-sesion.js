const { request, response } = require('express');

const validateSesion = (req = request, res = response, next) => {
  const { id } = req.params;

  const authId = req.authUser._id;

  if(id != authId) {
    return res.status(401).json({
      msg: 'El usuario que intenta realizar la accion no es el mismo que se autentico'
    })
  }

  next();
}

module.exports = {
  validateSesion
}