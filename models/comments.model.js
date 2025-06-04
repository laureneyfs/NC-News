const db = require("../db/connection");
const fetchCommentsByArticleId = (req, res) => {
  const { article_id } = req.params;
  return db
    .query(`SELECT * FROM comments WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
      console.log(rows);
      const comments = rows;
      return comments;
    });
};

module.exports = { fetchCommentsByArticleId };
