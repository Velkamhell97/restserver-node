const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares');

const { search, searchRelation } = require('../controllers/searchs');

const router = Router();

router.get('/:collection/:word', [
 
], search)

router.get('/:collection', [
 
], searchRelation)

module.exports = router;