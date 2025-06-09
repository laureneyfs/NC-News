const db = require("../db/connection");

const fetchUsers = () => {
  return db
    .query("SELECT username, name, avatar_url FROM users")
    .then(({ rows }) => {
      const users = rows;
      return users;
    });
};

const fetchUserByUsername = (username) => {
  return db
    .query("SELECT username, name, avatar_url FROM users WHERE username = $1", [
      username,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, error: "not found" });
      } else {
        const user = rows[0];
        return user;
      }
    });
};

module.exports = { fetchUsers, fetchUserByUsername };
