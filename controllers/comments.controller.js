const { fetchCommentsByArticleId } = require("../models/comments.model");

const getCommentsByArticleId = (req, res) => {
  return fetchCommentsByArticleId(req, res).then((article) => {
    res.status(200).send({ article: article });
  });
};

module.exports = { getCommentsByArticleId };
