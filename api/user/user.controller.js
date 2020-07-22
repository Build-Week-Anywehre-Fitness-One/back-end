const { find } = require("./user.model");

async function getAllUsers(req, res) {
  try {
    let users = await find();
    res.status(200).json(users);
  } catch (e) {
    res.status(500).json({ message: "uable to get users" });
  }
}

module.exports = { getAllUsers };
