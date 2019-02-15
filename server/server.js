const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

const bodyParser = require("body-parser");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

// parse application/json
app.use(bodyParser.json());


app.get("/usuario", (req, res) => {
  res.json("get Usuario");
});

app.post("/usuario", (req, res) => {
  const body = req.body;

  res.json(body);
});

app.put("/usuario/:id", (req, res) => {
  const id = req.params.id;

  res.json({
    id
  });
});

app.delete("/usuario", (req, res) => {
  res.json("delete Usuario");
});

app.listen(port, () => console.log(`Server running in port: ${port}`));