const bcrypt = require("bcryptjs");
const { insert, findBy } = require("../user/user.model");
const { generateToken } = require("./auth.service");
const Instructor_Sign_Up_Auth_Code = "32ML0321*)";

async function register(req, res) {
  let { username, password, role, auth_code } = req.body;
  if (!username || !password || !role) {
    return res
      .status(400)
      .json({ message: "username, password and role is required" });
  }

  // handle case for instructor role
  if (role === "instructor") {
    if (!auth_code) {
      return res.status(400).json({
        message:
          "must supply valid authorization code when registering an instructor"
      });
    }

    if (Instructor_Sign_Up_Auth_Code !== auth_code) {
      return res
        .status(400)
        .json({ message: "Invalid sign up authorization code for instructor" });
    }
  }

  try {
    password = await bcrypt.hash(password, 12);
    let user = await insert({ username, password, role });
    const token = generateToken(user);
    res.status(201).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: token
    });
  } catch (e) {
    res.status(500).json({ message: "Unable to register new user", error: e });
  }
}

async function login(req, res) {
  let { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "username and password is required" });
  }
  try {
    let user = await findBy({ username }).first();

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid username and/or password" });
    }

    let isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user || !isPasswordValid) {
      return res
        .status(400)
        .json({ message: "Invalid username and/or password" });
    }
    const token = generateToken(user);
    res.status(200).json({
      id: user.id,
      username: user.username,
      role: user.role,
      token: token
    });
  } catch (e) {
    res.status(500).json({ message: "Unable to login User" });
  }
}

module.exports = { register, login };
