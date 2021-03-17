const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');


class Server {

  constructor() {
    //Initialization
    this.app  = express();
    this.port = process.env.PORT;

    this.userRoutes = '/api/users';
    this.authRoutes = '/api/auth';

    //DB Connect
    this.database();

    //Middleware
    this.middlewares();

    //Routes
    this.routes();
  }

  async database() {
    await dbConnection();
  }

  middlewares() {
    //Cors
    //Esto es para proteger las peticiones que se le hacen al endpoint tambien sirve para agregar url a una lista blanca
    this.app.use(cors());

    //Parse
    //Esto es para decirle a la aplicacion de express que tipo de informacion recibira en las peticiones (post, put, delete)
    //Se pueden recibir tipos de archivo xlm
    this.app.use(express.json());

    //Public directory
    //Sirve el directorio estatico
    this.app.use(express.static('public'));
  }

  routes() {
    this.app.use(this.authRoutes, require('../routes/auth'));
    //Cuando pase una solicitud por esta ruta, se utilizara el router
    this.app.use(this.userRoutes, require('../routes/user'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`restserver app listening at http://localhost:${this.port}`)
    })
  }
}

module.exports = Server;