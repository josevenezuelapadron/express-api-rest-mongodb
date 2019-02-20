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

  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  }
}

app.post("/google", async (req, res) => {
  let token = req.body.idtoken;
  const googleUser = await verify(token).catch(err => {
    console.error(err);

    return res.status(403).json({
      ok: false,
      err
    });
  });

  Usuario.findOne({email: googleUser.email}, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (usuarioDB) {
      // Si el usuario ya se habia creado una cuenta sin google
      if (usuarioDB.google === false) {
        return res.status(400).json({
          ok: false,
          err: {
            message: "Debe usar su autenticacion normal"
          }
        });
      } else {
        // Si el usuario ya se habia creado su cuenta con google solo se renueva el token
        token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      }
    } else {
      // Si el usuario no existe en la BD
      const usuario = new Usuario();

      usuario.nombre = googleUser.nombre;
      usuario.email = googleUser.email;
      usuario.img = googleUser.nombre;
      usuario.google = true;
      usuario.password = ":)";

      usuario.save((err, usuarioDB) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            err
          });
        };

        token = jwt.sign({
          usuario: usuarioDB
        }, process.env.SEED, {expiresIn: process.env.CADUCIDAD_TOKEN});

        return res.status(200).json({
          ok: true,
          usuario: usuarioDB,
          token
        });
      });
    }
  });
});

module.exports = app;
