const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    const topics = rows;
    return topics;
  });
};

const validateTopic = (slug) => {
  return db
    .query(`SELECT * FROM topics WHERE slug = $1`, [slug])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 400, error: "bad request" });
      }
    });
};

module.exports = { fetchTopics, validateTopic };
