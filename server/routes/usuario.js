const express = require("express");
const bcrypt = require("bcrypt");
const _ = require("underscore");
const Usuario = require("../models/usuario.js");
const { verificaToken, verificaAdminRol } = require("../middlewares/autenticacion.js");
const app = express();

app.get("/usuario", verificaToken, (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 5;

  Usuario.find({estado: true}).skip(desde).limit(limite).exec((err, usuarios) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    Usuario.count({estado: true}, (err, conteo) => {
      return res.status(200).json({
        ok: true,
        conteo,
        usuarios
      });
    });
  });
});

app.post("/usuario", (req, res) => {
  const body = req.body;

  const usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  });

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    return res.status(201).json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.put("/usuario/:id", [verificaToken, verificaAdminRol], (req, res) => {
  const id = req.params.id;
  const body = _.pick(req.body, ["nombre", "email", "img", "role", "estado"]);

  Usuario.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    return res.status(200).json({
      ok: true,
      usuario: usuarioDB
    });
  });
});

app.delete("/usuario/:id", [verificaToken, verificaAdminRol], (req, res) => {
  const id = req.params.id;

  Usuario.findByIdAndUpdate(id, {estado: false}, {new: true}, (err, usuarioBorrado) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    if (!usuarioBorrado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: "Usuario no encontrado"
        }
      });
    };

    return res.status(200).json({
      ok: true,
      usuario: usuarioBorrado
    });
  }).exec();
});

module.exports = app;