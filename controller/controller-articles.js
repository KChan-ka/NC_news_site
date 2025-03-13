const modelMethods = require('../model/model.articles')


//fetch all articles
exports.fetchArticles = (req, res, next) => {
    const { sort_by, order, topic, limit, p } = req.query
    modelMethods.selectArticles(sort_by, order, topic, limit, p)
        .then((data) => {
            res.status(200).send({ articles: data, total_count: data.length })
        })
        .catch((err) => {
            next(err);
        })
}

//fetch article by article_id
exports.fetchArticleById = (req, res, next) => {
    const { article_id } = req.params
    modelMethods.selectArticleById(article_id)
        .then((data) => {
            res.status(200).send({ article: data })
        })
        .catch((err) => {
            next(err);
        })
}

//post a new article
exports.postArticle = (req, res, next) => {
    const { author, title, body, topic, article_img_url } = req.body
    modelMethods.insertArticle(author, title, body, topic, article_img_url)
        .then((data) => {
            res.status(201).send({ article: data })
        })
        .catch((err) => {
            next(err);
        })
}

//patch article
exports.patchArticleByArticleId = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    modelMethods.updateArticleByArticleId(article_id, inc_votes)
        .then((data) => {
            res.status(200).send({ article: data })
        })
        .catch((err) => {
            next(err);
        })
}

//delete a article
exports.removeArticle = (req, res, next) => {
    const { article_id } = req.params
    modelMethods.deleteArticle(article_id)
        .then((data) => {
            res.status(204).send({ topic: data })
        })
        .catch((err) => {
            next(err);
        })
}