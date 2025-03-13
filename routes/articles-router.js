const articlesRouter = require("express").Router();

const articleController = require("../controller/controller-articles")
const commentController = require("../controller/controller-comments")

articlesRouter.route("/")
    .get(articleController.fetchArticles)
    .post(articleController.postArticle)


articlesRouter.route("/:article_id")
    .get(articleController.fetchArticleById)
    .patch(articleController.patchArticleByArticleId)
    .delete(articleController.removeArticle)


articlesRouter.route("/:article_id/comments")
    .get(commentController.fetchCommentsByArticleId)
    .post(commentController.postCommentByArticleId)


module.exports = articlesRouter