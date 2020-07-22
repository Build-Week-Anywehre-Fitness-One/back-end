const express = require("express");
const {
  createClass,
  updateClass,
  removeClass,
  searchClass
} = require("./class.controller");
const { restricted, checkRole } = require("../auth/auth.middleware");

const classRouter = express.Router();

classRouter.get("/search", restricted, searchClass);
classRouter.post("/", restricted, checkRole("instructor"), createClass);
classRouter.put("/:id", restricted, checkRole("instructor"), updateClass);
classRouter.delete("/:id", restricted, checkRole("instructor"), removeClass);

module.exports = classRouter;
