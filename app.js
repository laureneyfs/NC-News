const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const { getArticles } = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);

module.exports = app;
