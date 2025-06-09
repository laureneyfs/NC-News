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

const createTopic = ({ slug, description }) => {
  return db
    .query(
      `INSERT INTO topics (slug, description) VALUES ($1, $2) RETURNING *`,
      [slug, description]
    )
    .then(({ rows }) => {
      const createdTopic = rows[0];
      return createdTopic;
    });
};

module.exports = { fetchTopics, validateTopic, createTopic };
