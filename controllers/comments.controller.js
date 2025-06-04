const {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
} = require("../models/comments.model");

const getCommentsByArticleId = (req, res) => {
  return fetchCommentsByArticleId(req, res).then((comments) => {
    res.status(200).send({ comments });
  });
};

const postCommentByArticleId = (req, res) => {
  return createComment(req, res).then((newComment) => {
    res.status(201).send({ newComment });
  });
};

const deleteCommentbyId = (req, res) => {
  return removeComment(req, res).then((response) => {
    res.status(204).send({ response });
  });
};

module.exports = {
  deleteCommentbyId,
  getCommentsByArticleId,
  postCommentByArticleId,
};
