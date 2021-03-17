const validateFields = require('../middlewares/fields-validator');
const validateJWT= require('../middlewares/validate-jwt');
const validateRole = require('../middlewares/validate-role');   

module.exports = {
  ...validateFields,
  ...validateJWT,
  ...validateRole
}