const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.json({name: "José"});
});

app.listen(port, () => console.log(`Server running in port: ${port}`));