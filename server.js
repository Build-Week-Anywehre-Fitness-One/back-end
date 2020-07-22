const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const api = require("./api");

const server = express();

server.use(helmet());
server.use(cors());

server.use(express.urlencoded({ extended: true }));
server.use(express.json());

server.use("/api", api);

module.exports = server;
