const { fetchArticles, fetchArticleById } = require("../models/articles.model");

const getArticles = (req, res) => {
  return fetchArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

const getArticleById = (req, res) => {
  return fetchArticleById(req, res).then((article) => {
    res.status(200).send({ article: article });
  });
};

module.exports = { getArticles, getArticleById };
