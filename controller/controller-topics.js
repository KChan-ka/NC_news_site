const modelMethods = require('../model/model.topics')

//fetch all slug and description data from topics table
exports.fetchTopics = (req, res, next) => {
    modelMethods.selectTopics()
        .then((data) => {
            res.status(200).send({ topics: data })
        })
        .catch((err) => {
            next(err);
        })
}

//post a new topics
exports.postTopic = (req, res, next) => {
    const { slug, description } = req.body
    modelMethods.insertTopic(slug, description)
        .then((data) => {
            res.status(201).send({ topic: data })
        })
        .catch((err) => {
            next(err);
        })
}