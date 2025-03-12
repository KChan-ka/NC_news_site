const topicsRouter = require("express").Router();

const controller = require("../controller/controller")

topicsRouter.route("/")
    .get(controller.fetchTopics)



module.exports = topicsRouter