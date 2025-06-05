const {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
} = require("../models/comments.model");

const getCommentsByArticleId = (req, res, next) => {
  return fetchCommentsByArticleId(req, res, next).then((comments) => {
    res.status(200).send({ comments });
  });
};

const postCommentByArticleId = (req, res, next) => {
  return createComment(req, res, next).then((newComment) => {
    res.status(201).send({ newComment });
  });
};

const deleteCommentbyId = (req, res, next) => {
  return removeComment(req, res, next).then(() => {
    res.status(204).send();
  });
};

module.exports = {
  deleteCommentbyId,
  getCommentsByArticleId,
  postCommentByArticleId,
};
