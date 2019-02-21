const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categoriaSchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, 'La descripción es obligatoria']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'Usuario'
  }
});


module.exports = mongoose.model('Categoria', categoriaSchema);