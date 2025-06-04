const db = require("../db/connection");

const fetchCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};

const createComment = (req, res) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      const addedComment = rows[0];
      return addedComment;
    });
};
module.exports = { fetchCommentsByArticleId, createComment };
