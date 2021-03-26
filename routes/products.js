const { Router } = require('express');
const { check } = require('express-validator');

const { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct } = require('../controllers/products');

const { validateFields, isValidJWT, hasRole } = require('../middlewares');

const { nameProductsUpdate, existProductById, existCategoryById } = require('../helpers/db-validators');

const router = Router();

/**
 * GET - obtener todas las categorias - publico
 */

router.get('/', getProducts)

/**
 * GET - obtener  una categoria por ID - publico
 */

router.get('/:id',[
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existProductById),
  validateFields
], getProductById)

/**
 * POST - crear categoria - privado - cualquier persona con un token valido
 */

router.post('/',[
  isValidJWT,
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('category','No es un id de categoria valido').isMongoId(),
  check('category').custom(existCategoryById),
  validateFields
], createProduct)

/**
 * PUT - actualizar categoria - privado - cualquier persona con un token valido
 */

router.put('/:id',[
  isValidJWT,
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existProductById),
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('name').custom(nameProductsUpdate),
  check('category', 'No es un id de categoria valido').isMongoId(),
  check('category').custom(existCategoryById),
  validateFields
], updateProduct)

/**
 * DELETE - eliminar categoria - privado - cualquier persona con un token valido
 */

router.delete('/:id',[
  isValidJWT,
  hasRole('ADMIN_ROLE'),
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existProductById),
  validateFields
], deleteProduct)



module.exports = router