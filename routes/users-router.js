const usersRouter = require("express").Router();

const controller = require("../controller/controller")

usersRouter.route("/")
    .get(controller.fetchUsers)



module.exports = usersRouter