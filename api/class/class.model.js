const db = require("../../data/dbConfig");

function findBy(filter) {
  let query = db("classes");
  if (filter.date) {
    query = query.where("date", "like", `%${filter.date}%`);
  }

  if (filter.location) {
    query = query.where("location", "like", `%${filter.location}%`);
  }

  if (filter.type) {
    query = query.where("type", "like", `%${filter.type}%`);
  }

  if (filter.startTime) {
    query = query.where("startTime", "like", `%${filter.startTime}%`);
  }

  if (filter.intensity) {
    query = query.where("intensity", "like", `%${filter.intensity}%`);
  }

  if (filter.duration) {
    query = query.where("duration", "like", `%${filter.duration}%`);
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
