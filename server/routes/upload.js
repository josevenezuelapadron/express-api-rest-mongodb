const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const { verificaToken } = require("../middlewares/autenticacion.js");
const Usuario = require("../models/usuario.js");
const Producto = require("../models/producto.js");
const fs = require("fs");
const path = require("path");

app.use(fileUpload());

app.put("/upload/:tipo/:id", verificaToken, (req, res) => {
  const tipo = req.params.tipo;
  const id = req.params.id;

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "No se ha seleccionado ningun archivo"
      }
    });
  }
  
  // Validar tipos
  const tipos = ["productos", "usuarios"];
  const extensiones = ["png", "jpg", "jpeg", "gif"];

  if (tipos.indexOf(tipo) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Los tipos permitidas son " + tipos.join(", ")
      }
    });
  }

  const archivo = req.files.archivo;
  const aux = archivo.name.split(".");

  const filename = aux[0];
  const extension = aux[aux.length - 1];

  // Si la extension del archivo subido no está en el array...
  if (extensiones.indexOf(extension.toLowerCase()) < 0) {
    return res.status(400).json({
      ok: false,
      err: {
        message: "Las extension permitidas son " + extensiones.join(", ")
      }
    });
  }

  const nombreArchivo = `${id}-${filename}-${new Date().getTime()}.${extension}`;

  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        err
      });
    }

    // Imagen ya cargada
    if (tipo == "usuarios") {
      imagenUsuario(id, res, nombreArchivo);
    } else if (tipo == "productos") {
      imagenProducto(id, res, nombreArchivo);
    }
  })
});


function imagenUsuario(id, res, nombreArchivo) {
  Usuario.findById(id, (err, usuarioDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "usuarios");

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!usuarioDB) {
      borraArchivo(nombreArchivo, "usuarios");

      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe el usuario"
        }
      });
    }

    borraArchivo("usuarios", usuarioDB.img);

    usuarioDB.img = nombreArchivo;
    usuarioDB.save((err, usuarioGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.status(200).json({
        ok: true,
        usuario: usuarioGuardado
      });
    });
  });
}


function imagenProducto(id, res, nombreArchivo) {
  Producto.findById(id, (err, productoDB) => {
    if (err) {
      borraArchivo(nombreArchivo, "productos");

      return res.status(500).json({
        ok: false,
        err
      });
    }

    if (!productoDB) {
      borraArchivo(nombreArchivo, "productos");

      return res.status(400).json({
        ok: false,
        err: {
          message: "No existe el producto"
        }
      });
    }
  
    borraArchivo("productos", productoDB.img);

    productoDB.img = nombreArchivo;
    productoDB.save((err, productoGuardado) => {
      if (err) {
        return res.status(500).json({
          ok: false,
          err
        });
      }

      return res.status(200).json({
        ok: true,
        producto: productoGuardado
      });
    });
  });
}


function borraArchivo(tipo, filename) {
  const pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${filename}`);
  if (fs.existsSync(pathImagen)) {
    fs.unlinkSync(pathImagen);
  }
}

module.exports = app;