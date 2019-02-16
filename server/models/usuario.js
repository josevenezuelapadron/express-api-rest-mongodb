const moongose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = moongose.Schema;

const usuarioSchema = new Schema({
  nombre: {
    type: String,
    required: [true, "El nombre es necesario"]
  },
  email: {
    type: String,
    required: [true, "El correo es necesario"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "La contraseña es necesaria"]
  },
  img: {
    type: String,
    required: false
  },
  role: {
    type: String,
    default: "USER_ROLE",
    required: false,
    enum: {
      values: ['ADMIN_ROLE', 'USER_ROLE'],
      message: '{VALUE} no es un rol valido'
    }
  },
  estado: {
    type: Boolean,
    default: true,
    required: false
  },
  google: {
    type: Boolean,
    default: false,
    required: false
  }
});

usuarioSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  delete userObject.password;

  return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
  message: '{PATH} debe de ser unico'
});

module.exports = moongose.model("Usuario", usuarioSchema);