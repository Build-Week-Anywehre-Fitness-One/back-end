const secrets = require("../../config/secrets");
const jwt = require("jsonwebtoken");

function restricted(req, res, next) {
  const token = req.headers.authorization;
  if (token) {
    jwt.verify(token, secrets.jwt_secret, (err, decodedToken) => {
      if (err) {
        res.status(401).json({ message: "Unable to authorize" });
      } else {
        req.decodedToken = decodedToken;
        next();
      }
    });
  } else {
    res.status(401).json({ message: "Unable to authorize" });
  }
}

function checkRole(role) {
  return (req, res, next) => {
    if (req.decodedToken.role && req.decodedToken.role === role) {
      next();
    } else {
      res.status(403).json({ message: "Unauthorize user" });
    }
  };
}

module.exports = { restricted, checkRole };
