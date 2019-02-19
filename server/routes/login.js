const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);
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

// Configuraciones de google
async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  console.log(payload.name);
  console.log(payload.email);
  console.log(payload.picture);
}

app.post("/google", (req, res) => {
  const token = req.body.idtoken;

  verify(token);

  res.status(200).json({
    token
  });
});

module.exports = app;
