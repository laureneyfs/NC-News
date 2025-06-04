const { fetchCommentsByArticleId } = require("../models/comments.model");

const getCommentsByArticleId = (req, res) => {
  return fetchCommentsByArticleId(req, res).then((comments) => {
    res.status(200).send({ comments });
  });
};

module.exports = { getCommentsByArticleId };
