const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ error: err.error });
  } else next(err);
};
const handlePgErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ error: "bad request" });
  } else if (err.code === "23503") {
    res.status(404).send({ error: "not found" });
  } else next(err);
};
const handleServerErrors = (err, req, res, next) => {
  res.status(500).send({ error: "something broke!" });
};

module.exports = { handleCustomErrors, handlePgErrors, handleServerErrors };
