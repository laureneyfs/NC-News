const express = require("express");
const app = express();
const endpointsJson = require("./endpoints.json");
const { getTopics } = require("./controllers/topics.controller");
const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
} = require("./controllers/articles.controller");
const { getUsers } = require("./controllers/users.controller");
const { getCommentsByArticleId } = require("./controllers/comments.controller");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.patch("/api/articles/:article_id", patchArticleVotesById);
module.exports = app;
