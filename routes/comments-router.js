const commentsRouter = require("express").Router();

const controller = require("../controller/controller")

commentsRouter.route("/:comment_id")
    .delete(controller.deleteCommentByCommentId)



module.exports = commentsRouter