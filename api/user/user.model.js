const db = require("../../data/dbConfig");

function find() {
  return db("users").select("id", "username", "role");
}

function findBy(filter) {
  return db("users").where(filter);
}

function findById(id) {
  return db("users")
    .select("id", "username", "role")
    .where({ id })
    .first();
}

function insert(user) {
  return db("users")
    .insert(user)
    .returning("id")
    .then(ids => {
      return findById(ids[0]);
    });
}

module.exports = { find, findBy, findById, insert };
