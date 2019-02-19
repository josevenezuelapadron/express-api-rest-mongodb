const jwt = require("jsonwebtoken");

const verificaToken = (req, res, next) => {
  const token = req.get("token");

  jwt.verify(token, process.env.SEED, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        ok: false,
        err: {
          message: "Token invalido"
        }
      });
    }

    req.usuario = decoded.usuario;
    next();
  });
};

const verificaAdminRol = (req, res, next) => {
  const usuario = req.usuario;

  if (usuario.role != "ADMIN_ROLE") {
    return res.status(401).json({
      ok: false,
      err: {
        message: "Debes ser administrador"
      },
      usuario
    });
  } else {
    next();
  }
};

module.exports = {
  verificaToken,
  verificaAdminRol
};
