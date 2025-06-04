const db = require("../db/connection");

const fetchUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then(({ rows }) => {
      const users = rows;
      return users;
    });
};

module.exports = { fetchUsers };
