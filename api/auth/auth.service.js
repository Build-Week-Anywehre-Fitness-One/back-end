const secrets = require("../../config/secrets");
const jwt = require("jsonwebtoken");

const secret = secrets.jwt_secret;

const options = { expiresIn: "30m" };

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    role: user.role
  };
  return jwt.sign(payload, secret, options);
}

module.exports = { generateToken };
