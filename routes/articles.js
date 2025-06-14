const express = require("express");
const router = express.Router();
const {
  getArticles,
  getArticleById,
  patchArticleVotesById,
  postArticle,
  deleteArticleById,
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
router.post("/", postArticle);
router.delete("/:article_id", deleteArticleById);

module.exports = router;
