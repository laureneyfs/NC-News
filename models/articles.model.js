const db = require("../db/connection");

const fetchArticles = () => {
  return db
    .query(
      `SELECT article_id, title, topic, articles.author, articles.created_at, articles.votes::INT, article_img_url, COUNT(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments USING (article_id) GROUP BY article_id, title, topic, articles.author, articles.created_at, articles.votes, article_img_url ORDER BY created_at DESC`
    )
    .then(({ rows }) => {
      console.log(typeof rows[0].comment_count);
      const articles = rows;
      return articles;
    })
    .catch((err) => {
      console.log("db query error:", err);
    });
};

module.exports = { fetchArticles };
