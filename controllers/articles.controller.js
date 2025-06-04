const { fetchArticles } = require("../models/articles.model");

const getArticles = (req, res) => {
  return fetchArticles().then((articles) => {
    res.status(200).send({ articles: articles });
  });
};

module.exports = { getArticles };
