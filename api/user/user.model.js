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

function joinClass(user_id, class_id) {
  return db("users_classes").insert({ user_id, class_id });
}

function removeFromClass(user_id, class_id) {
  return db("users_classes")
    .where({ user_id, class_id })
    .del();
}

function findUserClasses(id) {
  return db("users_classes")
    .select("classes.*")
    .join("classes", "users_classes.class_id", "=", "classes.id")
    .where("users_classes.user_id", id);
}

module.exports = {
  find,
  findBy,
  findById,
  insert,
  joinClass,
  removeFromClass,
  findUserClasses
};
