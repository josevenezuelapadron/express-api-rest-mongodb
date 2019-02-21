const express = require("express");
const { verificaToken, verificaAdminRol } = require("../middlewares/autenticacion.js");
const app = express();
const Categoria = require("../models/categoria.js");

// Obtiene todas las categorias
app.get("/categoria", verificaToken, (req, res) => {
  Categoria.find({}).sort("descripcion").populate("usuario", "nombre email").exec((err, categorias) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    Categoria.count({}, (err, conteo) => {
      return res.status(200).json({
        ok: true,
        conteo,
        categorias
      });
    });
  });
});

// Obtiene categoria por ID
app.get("/categoria/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.status(201).json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// Crear una nueva categoria
app.post("/categoria", verificaToken, (req, res) => {
  const descripcion = req.body.descripcion;
  const usuario = req.usuario._id;

  if (!descripcion) {
    return res.status(401).json({
      ok: false,
      err: {
        message: "La descripcion es obligatoria"
      }
    });
  }

  const categoria = new Categoria({
    descripcion,
    usuario
  });

  categoria.save((err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!categoriaDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.status(201).json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// Actualiza una categoria por ID
app.put("/categoria/:id", [verificaToken, verificaAdminRol], (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!categoriaDB) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "La categoria no existe"
        }
      });
    }

    return res.status(200).json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

// Elimina una categoria por ID
app.delete("/categoria/:id", [verificaToken, verificaAdminRol], (req, res) => {
  const id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!categoriaDB) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "La categoria no existe"
        }
      });
    }

    return res.status(200).json({
      ok: true,
      categoria: categoriaDB
    });
  });
});

module.exports = app;