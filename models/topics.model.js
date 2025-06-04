const db = require("../db/connection");

const fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    const topics = rows;
    return topics;
  });
};

module.exports = { fetchTopics };
