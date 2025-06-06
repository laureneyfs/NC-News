const {
  fetchArticles,
  fetchArticleById,
  adjustArticleVotesById,
} = require("../models/articles.model");

const getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;

  fetchArticles({ sort_by, order, topic })
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return fetchArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return adjustArticleVotesById(article_id, inc_votes)
    .then((adjustedArticle) => {
      res.status(200).send({ adjustedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticles, getArticleById, patchArticleVotesById };
