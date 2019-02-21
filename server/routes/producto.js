const express = require("express");
const Producto = require("../models/producto.js");
const { verificaToken } = require("../middlewares/autenticacion.js");
const app = express();

// Obtener todos los productos, populate: usuario, categoria, paginado
app.get("/productos", verificaToken, (req, res) => {
  const desde = Number(req.query.desde) || 0;
  const limite = Number(req.query.limite) || 0;

  Producto.find({})
    .skip(desde)
    .limit(limite)
    .populate("usuario", "nombre email")
    .populate("categoria", "descripcion")
    .exec((err, productos) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      };
  
      Producto.count({}, (err, conteo) => {
        return res.status(200).json({
          ok: true,
          conteo,
          productos
        });
      });
    });
});

// Buscar producto por frase
app.get("/productos/buscar/:termino", verificaToken, (req, res) => {
  const terminoBusqueda = req.params.termino;
  const regExp = new RegExp(terminoBusqueda, "i");

  Producto.find({ nombre: regExp })
  .populate("categoria", "descripcion")
  .exec((err, productos) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!productos) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.status(200).json({
      ok: true,
      productos
    });
  });
});

// Obtiene un producto por ID
app.get("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  Producto.findById(id, (err, productoDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    };

    if (!productoDB) {
      return res.status(400).json({
        ok: false,
        err
      });
    }

    return res.status(200).json({
      ok: true,
      producto: productoDB
    });
  });
});

// Crea un producto
app.post("/productos", verificaToken, (req, res) => {
  const body = req.body;
  const usuarioID = req.usuario._id;

  const producto = new Producto({
    nombre: body.nombre,
    precioUni: body.precioUni,
    descripcion: body.descripcion,
    disponible: body.disponible,
    categoria: body.categoriaID,
    usuario: usuarioID
  });

  producto.save((err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    return res.status(201).json({
      ok: true,
      producto: productoDB
    });
  });
});

// Actualizar un producto por ID
app.put("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    if (!productoDB) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "El producto no existe"
        }
      });
    }

    return res.status(200).json({
      ok: true,
      producto: productoDB
    });
  });
});

// Borra un producto
app.delete("/productos/:id", verificaToken, (req, res) => {
  const id = req.params.id;

  Producto.findByIdAndUpdate(id, {disponible: false}, {new: true}, (err, productoDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      });
    };

    if (!productoDB) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "El producto no existe"
        }
      });
    }

    return res.status(200).json({
      ok: true,
      producto: productoDB
    });
  });
});

module.exports = app;