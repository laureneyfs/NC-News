const {
  fetchArticles,
  fetchArticleById,
  adjustArticleVotesById,
} = require("../models/articles.model");

const getArticles = (req, res) => {
  return fetchArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

const getArticleById = (req, res) => {
  return fetchArticleById(req, res).then((article) => {
    res.status(200).send({ article });
  });
};

const patchArticleVotesById = (req, res) => {
  return adjustArticleVotesById(req, res).then((adjustedArticle) => {
    res.status(200).send({ adjustedArticle });
  });
};

module.exports = { getArticles, getArticleById, patchArticleVotesById };
