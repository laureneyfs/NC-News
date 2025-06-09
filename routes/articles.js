const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
} = require("../controllers/articles.controller");
const {
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("../controllers/comments.controller");

router.get("/", getArticles);
router.get("/:article_id", getArticleById);
router.get("/:article_id/comments", getCommentsByArticleId);
router.post("/:article_id/comments", postCommentByArticleId);
router.patch("/:article_id", patchArticleVotesById);

module.exports = router;
