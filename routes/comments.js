const express = require("express");
const router = express.Router();
const {
  deleteCommentbyId,
  patchCommentVotesById,
  getCommentbyId,
} = require("../controllers/comments.controller");

router.delete("/:comment_id", deleteCommentbyId);
router.get("/:comment_id", getCommentbyId);
router.patch("/:comment_id", patchCommentVotesById);

module.exports = router;
