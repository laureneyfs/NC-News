const {
  fetchArticles,
  fetchArticleById,
  adjustArticleVotesById,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  return fetchArticles(req, res, next).then((articles) => {
    res.status(200).send({ articles });
  });
};

const getArticleById = (req, res, next) => {
  return fetchArticleById(req, res, next).then((article) => {
    res.status(200).send({ article });
  });
};

const patchArticleVotesById = (req, res, next) => {
  return adjustArticleVotesById(req, res, next).then((adjustedArticle) => {
    res.status(200).send({ adjustedArticle });
  });
};

module.exports = { getArticles, getArticleById, patchArticleVotesById };
