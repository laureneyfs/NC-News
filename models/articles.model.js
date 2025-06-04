const db = require("../db/connection");

const fetchArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      const articles = rows;
      return articles;
    });
};

module.exports = { fetchArticles };
