const modelMethods = require('../model/model.comments')

//fetch comments from article id
exports.fetchCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {limit, p} = req.query
    modelMethods.selectCommentsByArticleId(article_id, limit, p)
        .then((data) => {
            res.status(200).send({ comments : data, totalCount: data.length })
        })
        .catch((err) => {
            next(err);
        })
}

//post a new comment
exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    modelMethods.insertCommentByArticleId(article_id, username, body)
        .then((data) => {
            res.status(201).send({ comment: data })
        })
        .catch((err) => {
            next(err);
        })
}

//delete comment by comment id
exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    modelMethods.deleteCommentByCommentId(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => {
            next(err);
        })
}

//patch comment by comment id
exports.patchCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body

    modelMethods.updateCommentByCommentId(comment_id, inc_votes)
        .then((data) => {
            res.status(200).send({ comment: data })
        })
        .catch((err) => {
            next(err);
        })
}
