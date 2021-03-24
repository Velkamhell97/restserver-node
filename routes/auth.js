const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/fields-validator');

const { googleVerify } = require('../helpers/google-verify');

const { login, google } = require('../controllers/auth');

const router = Router();

router.post('/login', [
  check('email','El correo es obligatorio').not().isEmpty(),
  check('email','El correo no es valido').isEmail(),
  check('password','La contraseña es obligatoria').not().isEmpty(),
  validateFields
], login)

router.post('/google', [
  check('id_token','El id_token es obligatorio').not().isEmpty(),
  //check('id_token').custom(googleVerify), //tambien se puede hacer por medio de un middleware custom
  validateFields
], google)

module.exports = router;