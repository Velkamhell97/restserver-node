const path = require('path');
const { v4:uuidv4 } = require('uuid');

const defultImageExtensions = ['png','jpg','jpge','gif'];

const uploadFiles = (files, extensions = defultImageExtensions, folder = '') => {

  return new Promise((resolve, reject) => {
    const { file } = files ;
    const extension = file.name.split('.').pop().toLowerCase();
 
    if(!extensions.includes(extension)){
      return reject(`La extension ${extension} no es permitida - extensiones permitidas ${extensions}`);
    }

    const tempName = uuidv4()+ '.' + extension;
    const uploadPath = path.join(__dirname, '../uploads/', folder, tempName);

    file.mv(uploadPath, (error) => {
      if (error) {
        return reject(error);
      }
      //en el resolve procurar devolver una variable y no un mensaje
      resolve(uploadPath);
    });
  })
}

module.exports = {
  uploadFiles
}





