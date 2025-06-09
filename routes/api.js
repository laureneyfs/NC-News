const express = require("express");
const router = express.Router();
const { getEndPoints } = require("../controllers/api.controller");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const usersRouter = require("./users");
const commentsRouter = require("./comments");

router.get("/", getEndPoints);

router.use("/topics", topicsRouter);
router.use("/articles", articlesRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);

module.exports = router;
