const db = require("../db/connection");

const fetchCommentsByArticleId = (articleId) => {
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [articleId])
    .then(({ rows }) => {
      const comments = rows;
      return comments;
    });
};

const createComment = (articleId, { username, body }) => {
  return db
    .query(
      `INSERT INTO comments (article_id, author, body) VALUES ($1, $2, $3) RETURNING *`,
      [articleId, username, body]
    )
    .then(({ rows }) => {
      const addedComment = rows[0];
      if (!addedComment.body) {
        return Promise.reject({ status: 400, error: "bad request" });
      } else return addedComment;
    });
};
const fetchCommentById = (commentId) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [commentId])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const comment = rows[0];
        return comment;
      }
    });
};
const removeComment = (commentId) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      commentId,
    ])
    .then(({ rows }) => {
      const deletedComment = rows[0];
      if (!deletedComment) {
        return Promise.reject({ status: 404, error: "comment not found" });
      } else return;
    });
};

const adjustCommentVotesById = (commentId, incVotes) => {
  if (!incVotes) {
    return Promise.reject({ status: 400, error: "bad request" });
  }
  return db
    .query(
      `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`,
      [incVotes, commentId]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const updatedComment = rows[0];
        return updatedComment;
      }
    });
};

module.exports = {
  fetchCommentsByArticleId,
  createComment,
  removeComment,
  adjustCommentVotesById,
  fetchCommentById,
};
