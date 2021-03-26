const { Router } = require('express');
const { check } = require('express-validator');

const { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory } = require('../controllers/categories');

const { validateFields, isValidJWT, hasRole } = require('../middlewares');

const { nameCategoryUpdate, existCategoryById } = require('../helpers/db-validators');

const router = Router();

/**
 * GET - obtener todas las categorias - publico
 */

router.get('/', getCategories)

/**
 * GET - obtener  una categoria por ID - publico
 */

router.get('/:id',[
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existCategoryById),
  validateFields
], getCategoryById)

/**
 * POST - crear categoria - privado - cualquier persona con un token valido
 */

router.post('/',[
  isValidJWT,
  check('name','El nombre es obligatorio').not().isEmpty(),
  validateFields
], createCategory)

/**
 * PUT - actualizar categoria - privado - cualquier persona con un token valido
 */

router.put('/:id',[
  isValidJWT,
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existCategoryById),
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('name').custom(nameCategoryUpdate),
  validateFields
], updateCategory)

/**
 * DELETE - eliminar categoria - privado - cualquier persona con un token valido
 */

router.delete('/:id',[
  isValidJWT,
  hasRole('ADMIN_ROLE'),
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existCategoryById),
  validateFields
], deleteCategory)



module.exports = router