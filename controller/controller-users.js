const modelMethods = require('../model/model.users')

//fetch all users
exports.fetchUsers = (req, res, next) => {
    modelMethods.selectUsers()
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

    modelMethods.selectUserByUsername(username)
        .then((data) => {
            res.status(200).send({ user: data })
        })
        .catch((err) => {
            next(err);
        })
}

