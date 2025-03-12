const articlesRouter = require("express").Router();

const controller = require("../controller/controller")

articlesRouter.route("/")
    .get(controller.fetchArticles)


articlesRouter.route("/:article_id")
    .get(controller.fetchArticleById)
    .patch(controller.patchArticleByArticleId)


articlesRouter.route("/:article_id/comments")
    .get(controller.fetchCommentsByArticleId)
    .post(controller.postCommentByArticleId)


module.exports = articlesRouter