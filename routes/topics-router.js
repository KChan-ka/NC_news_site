const topicsRouter = require("express").Router();

const controller = require("../controller/controller-topics")

topicsRouter.route("/")
    .get(controller.fetchTopics)
    .post(controller.postTopic)



module.exports = topicsRouter