const {
  fetchCommentsByArticleId,
  createComment,
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

module.exports = { getCommentsByArticleId, postCommentByArticleId };
