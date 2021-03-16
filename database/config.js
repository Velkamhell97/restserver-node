const mongoose = require('mongoose');

const dbConnection = async() => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECT, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    })

    console.log('Base de datos online');
  } catch (error) {
    console.log(error);
    throw new Error(`Error al iniciar la base de datos: ${error}`)
  }
}

module.exports = {
  dbConnection
}