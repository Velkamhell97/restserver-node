const { Router } = require('express');
const { getUser, postUser, putUser, deleteUser } = require('../controllers/user');

const router = Router();

//Como se utilizara un middleware al momento de llamar este archivo no es necesario colocar la ruta
router.get('/', getUser)

//Como se pasa la referencia de la funcion los parametros del metodo req,res son pasados a la funcion como argumentos
router.post('/', postUser)

router.put('/:id', putUser)

router.delete('/:id', deleteUser)

module.exports = router;
