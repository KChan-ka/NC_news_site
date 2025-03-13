const commentsRouter = require("express").Router();

const controller = require("../controller/controller-comments")

commentsRouter.route("/:comment_id")
    .delete(controller.deleteCommentByCommentId)
    .patch(controller.patchCommentByCommentId)



module.exports = commentsRouter