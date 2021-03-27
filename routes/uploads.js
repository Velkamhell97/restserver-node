const { Router } = require('express');
const { check, body } = require('express-validator');

const { isValidJWT, validateFields, validateFile } = require('../middlewares');

const { validateCollection } = require('../helpers')

const { createFiles, updateImageCloudinary, showImageCloudinary } = require('../controllers/uploads');

const router = Router();

const validCollections = ['users','products'];

router.get('/:collection/:id',[
  check('id', 'No es un id valido').isMongoId(),
  check('collection').custom(collection => validateCollection(collection,validCollections)),
  validateFields
], showImageCloudinary);

router.post('/',[
  validateFile, 
], createFiles);

router.put('/:collection/:id',[
  validateFile,
  check('id', 'No es un id valido').isMongoId(),
  check('collection').custom(collection => validateCollection(collection,validCollections)),
  validateFields
], updateImageCloudinary)

module.exports = router;