const {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
} = require("../models/comments.model");
const { fetchArticleById } = require("../models/articles.model");

const getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;

  const promises = [
    fetchArticleById(article_id),
    fetchCommentsByArticleId(article_id),
  ];

  Promise.all(promises)
    .then((resolvedPromises) => {
      const comments = resolvedPromises[1];
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const postCommentByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return createComment(article_id, { username, body })
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

const deleteCommentbyId = (req, res, next) => {
  const { comment_id } = req.params;
  return removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  deleteCommentbyId,
  getCommentsByArticleId,
  postCommentByArticleId,
};
