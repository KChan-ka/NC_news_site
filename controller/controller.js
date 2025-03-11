const {
    selectTopics,
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    insertCommentByArticleId,
    updateArticleByArticleId,
} = require('../model/model')

const endpointsJson = require("../endpoints.json");

//fetch all APIs
exports.fetchAllAPi = (req, res, next) => {
    res.status(200).send({endpoints : endpointsJson})
}


//fetch all slug and description data from topics table
exports.fetchTopics = (req, res, next) => {
    selectTopics()
        .then((rows) => {
            res.status(200).send({ topics: rows })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch article by article_id
exports.fetchArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
        .then((rows) => {
            res.status(200).send({ article: rows })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch all articles
exports.fetchArticles = (req, res, next) => {
    selectArticles()
        .then((rows) => {
            res.status(200).send({ articles : rows })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch comments from article id
exports.fetchCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleId(article_id)
        .then((rows) => {
            res.status(200).send({ comments : rows })
        })
        .catch((err) => {
            next(err);
        })
}

//post a new comment
exports.postCommentByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { username, body } = req.body
    insertCommentByArticleId(article_id, username, body)
        .then((rows) => {
            res.status(201).send({ comment: rows })
        })
        .catch((err) => {
            next(err);
        })
}

//patch a comment
exports.patchArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    updateArticleByArticleId(article_id, inc_votes)
        .then((rows) => {
            res.status(200).send({ article: rows })
        })
        .catch((err) => {
            next(err);
        })
}
