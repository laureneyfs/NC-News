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
const {
  getCommentsByArticleId,
  postCommentByArticleId,
  deleteCommentbyId,
} = require("./controllers/comments.controller");

const {
  handleCustomErrors,
  handleServerErrors,
  handlePgErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints: endpointsJson });
});

app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/users", getUsers);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId);
app.post("/api/articles/:article_id/comments", postCommentByArticleId);
app.patch("/api/articles/:article_id", patchArticleVotesById);
app.delete("/api/comments/:comment_id", deleteCommentbyId);
app.use(handleCustomErrors);
app.use(handlePgErrors);
app.use(handleServerErrors);

module.exports = app;
