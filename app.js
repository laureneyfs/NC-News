const express = require("express");
const app = express();
const apiRouter = require("./routes/api");
const {
  handleCustomErrors,
  handlePgErrors,
  handleServerErrors,
} = require("./errors");

app.use(express.json());
app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePgErrors);
app.use(handleServerErrors);

module.exports = app;
