const db = require("../db/connection");
const format = require("pg-format");

const fetchArticles = ({ sort_by, order, topic, limit, p }) => {
  const validOrderBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  const validOrder = ["ASC", "DESC"];

  if (sort_by && !validOrderBy.includes(sort_by)) {
    return Promise.reject({ status: 400, error: "bad request" });
  }

  if (order && !validOrder.includes(order?.toUpperCase())) {
    return Promise.reject({ status: 400, error: "bad request" });
  }

  const orderBy = validOrderBy.includes(sort_by) ? sort_by : "created_at";
  const orderAscOrDesc = validOrder.includes(order?.toUpperCase())
    ? order.toUpperCase()
    : "DESC";

  let queryStr = `SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments USING (article_id)`;

  if (topic) {
    queryStr += format(` WHERE topic = %L`, [topic]);
  }

  queryStr += format(
    ` GROUP BY article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url ORDER BY %I %s`,
    orderBy,
    orderAscOrDesc
  );

  if (limit) {
    queryStr += format(` LIMIT %s`, [limit]);
  } else {
    limit = 10;
    queryStr += ` LIMIT 10`;
  }
  if (p) {
    queryStr += format(` OFFSET %s`, (p - 1) * limit);
  }

  return db.query(queryStr).then(({ rows }) => rows);
};

const fetchArticleById = (articleId) => {
  return db
    .query(
      `SELECT articles.*, ( SELECT COUNT(*)::INT FROM comments WHERE comments.article_id = articles.article_id) AS comment_count FROM articles WHERE articles.article_id = $1;`,
      [articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const article = rows[0];
        return article;
      }
    });
};

const adjustArticleVotesById = (articleId, incVotes) => {
  if (!incVotes) {
    return Promise.reject({ status: 400, error: "bad request" });
  }
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [incVotes, articleId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const updatedArticle = rows[0];
        return updatedArticle;
      }
    });
};

const createArticle = ({ author, title, body, topic, article_img_url }) => {
  if (!article_img_url) {
    article_img_url =
      "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=128";
  }
  return db
    .query(
      `INSERT INTO articles (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [author, title, body, topic, article_img_url]
    )
    .then(({ rows }) => {
      const createdArticle = rows[0];
      if (!createdArticle.body || !createdArticle.author) {
        return Promise.reject({ status: 400, error: "bad request" });
      } else return createdArticle;
    });
};

const removeArticleById = (articleId) => {
  return db
    .query(`DELETE FROM articles WHERE article_id = $1 RETURNING *`, [
      articleId,
    ])
    .then(({ rows }) => {
      const deletedArticle = rows[0];
      if (!deletedArticle) {
        return Promise.reject({ status: 404, error: "article not found" });
      } else return;
    });
};

module.exports = {
  fetchArticles,
  fetchArticleById,
  adjustArticleVotesById,
  createArticle,
  removeArticleById,
};
