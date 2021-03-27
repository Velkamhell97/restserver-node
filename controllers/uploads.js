const path = require('path');
const fs = require('fs');
const { v4:uuidv4 } = require('uuid');

var cloudinary = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { request, response } = require('express');
const { uploadFiles } = require('../helpers');

const { User, Product } = require('../models');

const createFiles = async(req = request, res = response) => {
  try {
    const filePath = await uploadFiles(req.files, undefined, 'images');
    const fileName = filePath.split('\\').pop();

    res.json({
      msg: `Se subio el archivo correctamente`,
      path: filePath,
      name: fileName
    })
  } catch (error) {
    res.status(400).json({
      msg:error
    }) 
  }
}

const showImage = async(req = request, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch(collection){
    case "products":
      model = await Product.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un producto con el id: ${id}` 
        })
      }

      break;
    case "users":
      model = await User.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un usuario con el id: ${id}` 
        })
      }

      break;
    default: 
      res.status(500).json({
        msg:'Se me olvido progamar esto'
      })
  }

  try {
    if(model.img){
      const imagePath = path.join(__dirname, '../uploads', collection, model.img);
      if(fs.existsSync(imagePath)){
        return res.sendFile(imagePath);
      }
    }

    const placeHolderPath = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(placeHolderPath);
  } catch (error) {
    res.status(400).json({
      msg:error
    }) 
  }
}

const showImageCloudinary = async(req = request, res = response) => {
  const { collection, id } = req.params;

  let model;

  switch(collection){
    case "products":
      model = await Product.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un producto con el id: ${id}` 
        })
      }

      break;
    case "users":
      model = await User.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un usuario con el id: ${id}` 
        })
      }

      break;
    default: 
      res.status(500).json({
        msg:'Se me olvido progamar esto'
      })
  }

  try {
    if(model.img){
      res.set('Content-Type', 'text/html');
      res.write("<img src = "+model.img+">");
      return res.send();
    }

    const placeHolderPath = path.join(__dirname, '../assets/no-image.jpg');

    res.sendFile(placeHolderPath);
  } catch (error) {
    res.status(400).json({
      msg:error
    }) 
  }
}

const updateImage = async(req = request, res = response) => {
  
  const { collection, id } = req.params;

  let model;

  switch(collection){
    case "products":
      model = await Product.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un producto con el id: ${id}` 
        })
      }

      break;
    case "users":
      model = await User.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un usuario con el id: ${id}` 
        })
      }

      break;
    default: 
      res.status(500).json({
        msg:'Se me olvido progamar esto'
      })
  }

  try {
    if(model.img){
      const imagePath = path.join(__dirname, '../uploads', collection, model.img);
      if(fs.existsSync(imagePath)){
        fs.unlinkSync(imagePath);
      }
    }

    const filePath = await uploadFiles(req.files, undefined, collection);
    const fileName = filePath.split('\\').pop();

    model.img = fileName;

    await model.save();

    res.json({
      msg: `imagen actualizada correctamente`,
      model
    })
  } catch (error) {
    res.status(400).json({
      msg:error
    }) 
  }
}

const updateImageCloudinary = async(req = request, res = response) => {
  
  const { collection, id } = req.params;

  let model;

  switch(collection){
    case "products":
      model = await Product.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un producto con el id: ${id}` 
        })
      }

      break;
    case "users":
      model = await User.findById(id);

      if(!model){
        return res.status(400).json({
          msg:`No existe un usuario con el id: ${id}` 
        })
      }

      break;
    default: 
      res.status(500).json({
        msg:'Se me olvido progamar esto'
      })
  }

  try {
    if(model.img){
      const [imageId] = model.img.split('/').pop().split('.');
      cloudinary.uploader.destroy(`node-restserver-app/${collection}/${imageId}`); //podemos usar await pero no es necesario esperar
    }

    const { tempFilePath } = req.files.file;
    const response = await cloudinary.uploader.upload(tempFilePath,{
      public_id:`node-restserver-app/${collection}/${uuidv4()}`
    });

    model.img = response.secure_url;

    await model.save();

    res.json({
      msg: `imagen actualizada correctamente`,
      model
    })
  } catch (error) {
    res.status(400).json({
      msg:error
    }) 
  }
}

module.exports = {
  createFiles,
  updateImage,
  updateImageCloudinary,
  showImage,
  showImageCloudinary
}