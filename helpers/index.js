const dbSearchs = require('./db-searchs');
const dbValidators = require('./db-validators');
const generateJWT = require('./generate-jws');
const googleVerify = require('./google-verify');
const uploadFiles = require('./upload-file');

//Utilizamos los tres puntos para exportar cualquier propiedad
module.exports = {
  ...dbSearchs,
  ...dbValidators,
  ...generateJWT,
  ...googleVerify,
  ...uploadFiles
}