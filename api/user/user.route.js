const express = require("express");
const { getAllUsers, userJoinClass } = require("./user.controller");
const { restricted, checkRole } = require("../auth/auth.middleware");

const userRouter = express.Router();

userRouter.get("/", restricted, getAllUsers);
userRouter.get(
  "/:user_id/classes/:class_id",
  restricted,
  checkRole("client"),
  userJoinClass
);

module.exports = userRouter;
