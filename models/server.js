const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

  constructor() {
    //Initialization
    this.app  = express();
    this.port = process.env.PORT;
    this.userRoutes = '/api/users';
      

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
    this.app.use(cors());

    //Parse
    this.app.use(express.json());

    //Public directory
    this.app.use(express.static('public'));
  }

  routes() {
    //Auth routes
    this.app.use(this.authRoutes, require('../routes/auth'));

    //User routes
    this.app.use(this.userRoutes, require('../routes/user'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`restserver app listening at http://localhost:${this.port}`)
    })
  }
}

module.exports = Server;