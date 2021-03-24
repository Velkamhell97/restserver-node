const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } =require('../helpers/generate-jws');
const { googleVerify } = require('../helpers/google-verify');

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

const google = async(req = request, res = response) => {
  const { id_token } = req.body;
 
  try {
    const { name, email, img } = await googleVerify(id_token);

    let user = await User.findOne({email});

    //aqui depende de nosotros definir como manejar esta validacion si decirle que ya tiene una cuenta
    //con el correo de la app o dejarlo autenticar solo con el password o dejarlo seguir
    
    //Si el usuario no existe tengo que crearlo
    if(!user){
      const data = {
        name,
        email,
        password:':P', //El password no es importante en este tipo de autenticacion ya que se utiliza la de google
        img,
        google:true
      }

      user = new User(data);
      await user.save();
    }

    if(!user.state){
      res.status(401).json({
        msg:'Usuario bloqueado'
      })
    }

    const token = await generateJWT( user.id )
    
    res.json({
      msg:'Todo Ok google sign',
      user,
      token
    })
  } catch (error) {
    res.status(400).json({
      msg:'Token de google no es valido',
    })
  }
}

module.exports = {
  login,
  google
}