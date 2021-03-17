const { Router } = require('express');
const { check } = require('express-validator');

const { hasRole, isAdmin, isValidJWT, validateFields } = require('../middlewares');

const { isValidRole, emailExist, existUserById, emailUpdate } = require('../helpers/db-validators');

const { getUser, postUser, putUser, deleteUser } = require('../controllers/user');

const router = Router();

//Como se utilizara un middleware al momento de llamar este archivo no es necesario colocar la ruta
router.get('/', getUser)

//Como se pasa la referencia de la funcion los parametros del metodo req,res son pasados a la funcion como argumentos
router.post('/',[
  check('name', 'El nombre es obligatorio').not().isEmpty(),
  check('password', 'El password debe ser mayor de 6 caracteres').isLength({min:6}),
  check('email', 'El correo no es valido').isEmail(),
  check('email').custom(emailExist),
  //check('role', 'No es un rol valido').isIn(['ADMIN_ROLE','USER_ROLE']),
  check('role').custom(isValidRole),
  validateFields,
], postUser)

router.put('/:id', [
  check('id','No es un id valido').isMongoId(),
  check('id').custom(existUserById),
  check('email').custom(emailUpdate),
  check('role', 'El rol es requerido').not().isEmpty(),
  check('role').custom(isValidRole),
  validateFields
], putUser)

router.delete('/:id', [
  isValidJWT, //deberia ser el primero en ejecutarse,
  //isAdmin,
  hasRole('ADMIN_ROLE','VENTAS_ROLE'),
  check('id','No es un id valido').isMongoId(),
  check('id').custom(existUserById),
  validateFields
] ,deleteUser)

module.exports = router;
