const db = require("../db/connection");
const format = require("pg-format");

const fetchArticles = (req, res, next) => {
  const { sort_by = "created_at", order = "DESC" } = req.query; //required despite another variable below
  let orderBy = "created_at";
  let orderAscOrDesc = "DESC";

  //could do a 'doesnt include' check where default values are set if it doesn't pass the test below, might be slightly more efficient
  const validOrderBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "img_url",
    "comment_count",
  ];

  const validOrder = ["ASC, DESC"];

  if (req.query.sort_by && validOrderBy.includes(sort_by)) {
    orderBy = sort_by;
  }
  if (req.query.order && validOrder.includes(order.toLowerCase())) {
    orderAscOrDesc = order;
  }

  const queryStr = format(
    `SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url ORDER BY %I %s`,
    sort_by,
    order
  );

  return db.query(queryStr).then(({ rows }) => {
    const articles = rows;
    return articles;
  });
};

const fetchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const article = rows[0];
        return article;
      }
    })
    .catch((err) => {
      next(err);
    });
};

const adjustArticleVotesById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  return db
    .query(
      `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const updatedArticle = rows[0];
        return updatedArticle;
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { fetchArticles, fetchArticleById, adjustArticleVotesById };
