const endpointsJson = require("../db/data/endpoints.json");

const getEndPoints = (req, res) => {
  return res.render("index");
};

module.exports = { getEndPoints };
