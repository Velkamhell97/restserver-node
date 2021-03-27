const { Schema, model } = require('mongoose');

const productSchema = Schema({
  name: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    unique: true
  },
  state: {
    type: Boolean,
    default: true,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  price: {
    type: Number,
    default: 0
  },
  img:{
    type: String
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    require: true
  },
  description: {
    type: String,
    default: 'Sin descripcion'
  }, 
  available: {
    type: Boolean,
    default: true
  }
})

productSchema.methods.toJSON = function() {
  const { __v, state, ...product } = this.toObject();
  //product.uid = _id;
  return product;
}

module.exports = model('Product', productSchema)