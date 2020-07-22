const express = require("express");
const { getAllUsers } = require("./user.controller");
const { restricted } = require("../auth/auth.middleware");

const userRouter = express.Router();

userRouter.get("/", restricted, getAllUsers);

module.exports = userRouter;
