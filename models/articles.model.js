const db = require("../db/connection");
const format = require("pg-format");

const fetchArticles = ({ sort_by, order, topic }) => {
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

  // if (topic) {
  //   db.query(`SELECT slug FROM topics WHERE slug = $1`, [topic]).then(
  //     ({ rows }) => {
  //       if (!rows.length) {
  //         return Promise.reject({ status: 400, error: "bad request" });
  //       }
  //     }
  //   );
  // }

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

module.exports = { fetchArticles, fetchArticleById, adjustArticleVotesById };
