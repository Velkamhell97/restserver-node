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

router.get('/', getCategories)

router.get('/:id',[
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existCategoryById),
  validateFields
], getCategoryById)

router.post('/',[
  isValidJWT,
  check('name','El nombre es obligatorio').not().isEmpty(),
  validateFields
], createCategory)

router.put('/:id',[
  isValidJWT,
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existCategoryById),
  check('name','El nombre es obligatorio').not().isEmpty(),
  check('name').custom(nameCategoryUpdate),
  validateFields
], updateCategory)

router.delete('/:id',[
  isValidJWT,
  hasRole('ADMIN_ROLE'),
  check('id','El id no es valido').isMongoId(),
  check('id').custom(existCategoryById),
  validateFields
], deleteCategory)



module.exports = router