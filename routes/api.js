const express = require("express");
const router = express.Router();
const { getEndPoints } = require("../controllers/api.controller");
const topicsRouter = require("./topics");
const articlesRouter = require("./articles");
const usersRouter = require("./users");
const commentsRouter = require("./comments");

router.use("/", express.static("public"));
router.get("/json", getEndPoints);

router.use("/topics", topicsRouter);
router.use("/articles", articlesRouter);
router.use("/users", usersRouter);
router.use("/comments", commentsRouter);

module.exports = router;
