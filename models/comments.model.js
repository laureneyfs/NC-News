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

const removeComment = (req, res) => {
  const { comment_id } = req.params;
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then(() => {
      const response = `successfully deleted comment ${comment_id}`;
      return response;
    });
};

module.exports = { fetchCommentsByArticleId, createComment, removeComment };
