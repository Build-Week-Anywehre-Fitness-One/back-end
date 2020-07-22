exports.up = function(knex) {
  return knex.schema
    .createTable("users", tbl => {
      tbl.increments();
      tbl
        .string("username", 128)
        .unique()
        .notNullable();
      tbl.string("password", 255).notNullable();
      tbl.string("role", 10).notNullable();
    })
    .createTable("classes", tbl => {
      tbl.increments();
      tbl.string("name", 255).notNullable();
      tbl.string("type", 255).notNullable();
      tbl.string("startTime", 255).notNullable(); // format time HH:MM
      tbl.string("date", 255); // format date YYYY-MM-DD
      tbl.integer("duration", 255).notNullable(); // minutes
      tbl.string("intensity").notNullable(); // low, medium, high
      tbl.string("location", 255).notNullable(); // an address
      tbl.integer("numberOfRegisteredAttendees").notNullable();
      tbl.integer("maxClassSize").notNullable();
    })
    .createTable("users_classes", tbl => {
      tbl
        .integer("user_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("users")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl
        .integer("class_id")
        .unsigned()
        .notNullable()
        .references("id")
        .inTable("classes")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");

      tbl.primary(["user_id", "class_id"]);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTableIfExists("users_classes")
    .dropTableIfExists("classes")
    .dropTableIfExists("users");
};
