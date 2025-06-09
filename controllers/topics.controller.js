const { fetchTopics, createTopic } = require("../models/topics.model.js");

const getTopics = (req, res) => {
  return fetchTopics().then((topics) => {
    res.status(200).send({ topics });
  });
};

const postTopic = (req, res, next) => {
  const { slug, description } = req.body;
  return createTopic({ slug, description })
    .then((createdTopic) => {
      res.status(201).send({ createdTopic });
    })
    .catch((err) => {
      next(err);
    });
};
module.exports = { getTopics, postTopic };
