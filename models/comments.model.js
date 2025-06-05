const db = require("../db/connection");

const fetchCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const comments = rows;
        return comments;
      }
    })
    .catch((err) => {
      next(err);
    });
};

const createComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [article_id, username, body]
    )
    .then(({ rows }) => {
      const addedComment = rows[0];
      if (!addedComment.body) {
        return Promise.reject({ status: 400, error: "bad request" });
      } else return addedComment;
    })
    .catch((err) => {
      next(err);
    });
};

const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then(({ rows }) => {
      const deletedComment = rows[0];
      if (!deletedComment) {
        return Promise.reject({ status: 404, error: "comment not found" });
      } else return;
    })
    .catch((err) => {
      next(err);
      console.log(err);
    });
};

module.exports = { fetchCommentsByArticleId, createComment, removeComment };
