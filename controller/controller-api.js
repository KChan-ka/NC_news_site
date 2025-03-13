const endpointsJson = require("../endpoints.json");

//fetch all APIs
exports.fetchAllAPi = (req, res, next) => {
    res.status(200).send({endpoints : endpointsJson})
}