const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/fields-validator');

const { login } = require('../controllers/auth');

const router = Router();

router.post('/login', [
  check('email','El correo es obligatorio').not().isEmpty(),
  check('email','El correo no es valido').isEmail(),
  check('password','La contraseña es obligatoria').not().isEmpty(),
  validateFields
], login)

module.exports = router;