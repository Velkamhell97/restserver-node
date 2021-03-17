const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } =require('../helpers/generate-jws');

const login = async(req = request, res = response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({email});
    if(!user){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - correo'
      })
    }

    if(!user.state){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - state:false'
      })
    }

    const validPassword = bcryptjs.compareSync(password, user.password);

    if(!validPassword){
      return res.status(400).json({
        msg: 'Usuario / Password no son correctos - password'
      })
    }
   
    const token = await generateJWT(user.id);

    res.json({
      msg:'Login ok',
      user,
      token
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg:'Algo salio mal',
      error
    })
  }

}

module.exports = {
  login
}