const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const { verificaTokenImg } = require("../middlewares/autenticacion.js");

app.get("/imagen/:tipo/:img", verificaTokenImg, (req, res) => {
  const tipo = req.params.tipo;
  const img = req.params.img;

  if (tipo != "productos" && tipo != "usuarios") {
    return res.status(400).json({
      ok: false,
      err: {
        message: "El tipo debe ser productos o usuarios"
      }
    });
  }

  const pathImg = `./uploads/${tipo}/${img}`;

  if (fs.existsSync(pathImg)) {
    return res.status(200).sendFile(path.resolve(__dirname, `../../${pathImg}`));
  } else {
    return res.status(400).sendFile(path.resolve(__dirname, "../assets/no-image.jpg"));
  }
});

module.exports = app;