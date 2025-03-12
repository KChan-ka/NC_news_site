const {
    selectTopics,
    selectUsers,
    selectArticleById,
    selectArticles,
    selectCommentsByArticleId,
    insertCommentByArticleId,
    updateArticleByArticleId,
    deleteCommentByCommentId,
    selectUserByUsername,
    updateCommentByCommentId,
    insertArticle,
} = require('../model/model')

const endpointsJson = require("../endpoints.json");

//fetch all APIs
exports.fetchAllAPi = (req, res, next) => {
    res.status(200).send({endpoints : endpointsJson})
}


//fetch all slug and description data from topics table
exports.fetchTopics = (req, res, next) => {
    selectTopics()
        .then((data) => {
            res.status(200).send({ topics: data })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch article by article_id
exports.fetchArticleById = (req, res, next) => {
    const { article_id } = req.params
    selectArticleById(article_id)
        .then((data) => {
            res.status(200).send({ article: data })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch all articles
exports.fetchArticles = (req, res, next) => {
    const {sort_by, order, topic,  limit, p} = req.query
    selectArticles(sort_by, order, topic, limit, p)
        .then((data) => {
            res.status(200).send({ articles : data })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch comments from article id
exports.fetchCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleId(article_id)
        .then((data) => {
            res.status(200).send({ comments : data })
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
        .then((data) => {
            res.status(201).send({ comment: data })
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
        .then((data) => {
            res.status(200).send({ article: data })
        })
        .catch((err) => {
            next(err);
        })
}

//delete comment by comment id
exports.deleteCommentByCommentId = (req, res, next) => {
    const { comment_id } = req.params
    deleteCommentByCommentId(comment_id)
        .then(() => {
            res.status(204).send()
        })
        .catch((err) => {
            next(err);
        })
}


//fetch all users
exports.fetchUsers = (req, res, next) => {
    selectUsers()
        .then((data) => {
            res.status(200).send({ users: data })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch user by username
exports.fetchUserByUsername = (req, res, next) => {
    const {username} = req.params

    selectUserByUsername(username)
        .then((data) => {
            res.status(200).send({ user: data })
        })
        .catch((err) => {
            next(err);
        })
}

//patch comment by comment id
exports.patchCommentByCommentId = (req, res, next) => {
    const {comment_id} = req.params
    const {inc_votes} = req.body

    updateCommentByCommentId(comment_id, inc_votes)
        .then((data) => {
            res.status(200).send({ comment: data })
        })
        .catch((err) => {
            next(err);
        })
}

//post a new article
exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    insertArticle(author, title, body, topic, article_img_url)
        .then((data) => {
            res.status(201).send({ article: data })
        })
        .catch((err) => {
            next(err);
        })
}