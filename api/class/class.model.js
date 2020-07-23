const db = require("../../data/dbConfig");

// set like operator
// ilike for postgres in production to make search case insensitive
const LIKE_OPERATOR = process.env.NODE_ENV === "production" ? "ilike" : "like";

function findBy(filter) {
  let query = db("classes");
  if (filter.date) {
    query = query.where("date", `${LIKE_OPERATOR}`, `%${filter.date}%`);
  }

  if (filter.location) {
    query = query.where("location", `${LIKE_OPERATOR}`, `%${filter.location}%`);
  }

  if (filter.type) {
    query = query.where("type", `${LIKE_OPERATOR}`, `%${filter.type}%`);
  }

  if (filter.startTime) {
    query = query.where(
      "startTime",
      `${LIKE_OPERATOR}`,
      `%${filter.startTime}%`
    );
  }

  if (filter.intensity) {
    query = query.where(
      "intensity",
      `${LIKE_OPERATOR}`,
      `%${filter.intensity}%`
    );
  }

  if (filter.duration) {
    query = query.where("duration", filter.duration);
  }

  return query.select();
}

function findById(id) {
  return db("classes")
    .where({ id })
    .first();
}

async function insert(classes, user_id) {
  try {
    const [class_id] = await db("classes")
      .insert(classes)
      .returning("id");
    const newClass = await findById(class_id);

    // make sure to establish many to many relationship with users <-> classes
    await db("users_classes").insert({ user_id, class_id });

    return newClass;
  } catch (e) {
    return e;
  }
}

function update(id, changes) {
  return db("classes")
    .where({ id })
    .update(changes)
    .then(() => {
      return findById(id);
    });
}

function remove(id) {
  return db("classes")
    .where({ id })
    .del();
}

module.exports = { findBy, findById, insert, update, remove };
