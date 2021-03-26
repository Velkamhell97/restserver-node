const validateFields = require('../middlewares/fields-validator');
const validateJWT= require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-role');  
const validateSesion = require('../middlewares/validate-sesion');

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRole,
  ...validateSesion
}