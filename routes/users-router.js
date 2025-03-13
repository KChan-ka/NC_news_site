const usersRouter = require("express").Router();

const controller = require("../controller/controller-users")

usersRouter.route("/")
    .get(controller.fetchUsers)

usersRouter.route("/:username")
    .get(controller.fetchUserByUsername)



module.exports = usersRouter