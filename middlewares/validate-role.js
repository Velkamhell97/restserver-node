const { request, response } = require("express");

const isAdmin = (req = request, res = response, next) => {
  if(!req.authUser){
    return res.status(500).json({
      msg:'Se quiere verificar el rol sin validar el token primero'
    })
  }

  const { role, name } = req.authUser;
  
  if(role !== 'ADMIN_ROLE'){
    return res.status(400).json({
      msg:`${name} no es administrador - No puede ejecutar la operacion`
    })
  }
  
  next();
}

//Podemos recibir parametros propios pero al final debemos devolver una funcion con los parametros req,res,next
const hasRole = (...roles) => {
  return (req = request, res = response, next) => {
    if(!req.authUser){
      return res.status(500).json({
        msg:'Se quiere verificar el rol sin validar el token primero'
      })
    }

    if(!roles.includes(req.authUser.role)){
      return res.status(401).json({
        msg:`El usuario require uno de estos roles: ${roles}` 
      })
    }

    next();
  }
}

module.exports = {
  isAdmin,
  hasRole
}