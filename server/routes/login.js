const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario.js");

app.post("/login", (req, res) => {
  const body = req.body;

  Usuario.findOne({email: body.email}, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "(Correo)/contraseña invalido"
        }
      });
    } else if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Correo/(contraseña) invalido"
        }
      });
    };

    const token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

    return res.status(200).json({
      ok: true,
      usuario: usuarioDB,
      token
    });
  });

  
});

module.exports = app;
