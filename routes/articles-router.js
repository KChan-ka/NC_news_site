const articlesRouter = require("express").Router();

const controller = require("../controller/controller")

articlesRouter.route("/")
    .get(controller.fetchArticles)
    .post(controller.postArticle)


articlesRouter.route("/:article_id")
    .get(controller.fetchArticleById)
    .patch(controller.patchArticleByArticleId)
    .delete(controller.removeArticle)


articlesRouter.route("/:article_id/comments")
    .get(controller.fetchCommentsByArticleId)
    .post(controller.postCommentByArticleId)


module.exports = articlesRouter