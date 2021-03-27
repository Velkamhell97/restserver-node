const { Router } = require('express');
const { check, query } = require('express-validator');

const { validateFields } = require('../middlewares');

const { validateCollection, validateQuerys } = require('../helpers');

const { search, searchRelation } = require('../controllers/searchs');

const validCollections = ['users','categories','products','roles'];
const validQuerys = ['user','category'];

const router = Router();

//Se le puede agregar la valiadcion de los jwt
router.get('/:collection/:word', [
  check('collection').custom(collection => validateCollection(collection, validCollections)),
  validateFields
], search)

router.get('/:collection', [
  check('collection').custom(collection => validateCollection(collection, validCollections)),
  query().custom(querys => validateQuerys(querys, validQuerys)),
  validateFields
], searchRelation)

module.exports = router;