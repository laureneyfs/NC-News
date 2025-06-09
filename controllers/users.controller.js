const { fetchUsers, fetchUserByUsername } = require("../models/users.model.js");

const getUsers = (req, res) => {
  return fetchUsers().then((users) => {
    res.status(200).send({ users });
  });
};

const getUserByUsername = (req, res, next) => {
  const { username } = req.params;
  return fetchUserByUsername(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUsers, getUserByUsername };
