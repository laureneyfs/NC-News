const {
  fetchArticles,
  fetchArticleById,
  adjustArticleVotesById,
  createArticle,
} = require("../models/articles.model");
const { validateTopic } = require("../models/topics.model");

const getArticles = (req, res, next) => {
  const { sort_by, order, topic } = req.query;
  const promises = [fetchArticles({ sort_by, order, topic })];

  if (topic) {
    promises.push(validateTopic(topic));
  }

  Promise.all(promises)
    .then((resolvedPromises) => {
      const articles = resolvedPromises[0];
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
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

const postArticle = (req, res, next) => {
  const { author, title, body, topic, article_img_url } = req.body;

  return createArticle({ author, title, body, topic, article_img_url })
    .then((createdArticle) => {
      res.status(201).send({ createdArticle });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticles,
  getArticleById,
  patchArticleVotesById,
  postArticle,
};
