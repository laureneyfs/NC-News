const express = require("express");
const app = express();
const apiRouter = require("./routes/api");
const {
  handleCustomErrors,
  handlePgErrors,
  handleServerErrors,
} = require("./errors");

app.use(express.json());
app.set("views engine", "ejs");
app.set("views", "public");
app.use(express.static("views"));
app.use("/api", apiRouter);

app.use(handleCustomErrors);
app.use(handlePgErrors);
app.use(handleServerErrors);

module.exports = app;
