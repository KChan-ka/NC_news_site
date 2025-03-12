const usersRouter = require("express").Router();

const controller = require("../controller/controller")

usersRouter.route("/")
    .get(controller.fetchUsers)

usersRouter.route("/:username")
    .get(controller.fetchUserByUsername)



module.exports = usersRouter