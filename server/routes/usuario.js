const express = require("express");
const bcrypt = require("bcrypt");
const Usuario = require("../models/usuario.js");
const app = express();

app.get("/usuario", (req, res) => {
  res.json("get Usuario dev");
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

app.put("/usuario/:id", (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Usuario.findByIdAndUpdate(id, body, {new: true}, (err, usuarioDB) => {
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

app.delete("/usuario", (req, res) => {
  res.json("delete Usuario");
});

module.exports = app;