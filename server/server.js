require("./config/configu.js");
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = process.env.PORT;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());

// Habilitar carpeta public
app.use(express.static(path.resolve(__dirname, "../public")));

// routes
app.use(require("./routes/index.js"));


mongoose.connect(process.env.URLDB, {useNewUrlParser: true}, err => {
  if (err) throw err;

  console.log("Conexión exitosa");
});

app.listen(port, () => console.log(`Server running in port: ${port}`));
