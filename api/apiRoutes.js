const express = require("express");
const authRouter = require("./auth");
const userRouter = require("./user");
const classRouter = require("./class");

const apiRouter = express.Router();

apiRouter.use("/", authRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/classes", classRouter);

module.exports = apiRouter;
