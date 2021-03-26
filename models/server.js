const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

  constructor() {
    //Initialization
    this.app  = express();
    this.port = process.env.PORT;

    this.paths = { //Es buena practica organizar el codigo en orden alfabetico
      auth       : '/api/auth',
      categories : '/api/categories',
      products   : '/api/products',
      searchs    : '/api/searchs',
      users      : '/api/users',
    }      

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
    this.app.use(this.paths.auth, require('../routes/auth'));

    //Categories routes
    this.app.use(this.paths.categories, require('../routes/categories'));
    
    //Products routes
    this.app.use(this.paths.products, require('../routes/products'));

    //Searchs routes
    this.app.use(this.paths.searchs, require('../routes/searchs'));

    //User routes
    this.app.use(this.paths.users, require('../routes/users'));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`restserver app listening at http://localhost:${this.port}`)
    })
  }
}

module.exports = Server;