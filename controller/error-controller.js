// error handling file

exports.handleEmptyDataErrors = (err, req, res, next) => {
    if (err.status === 404) {
        res.status(err.status).send({ msg: err.msg })
    }
    else {
        next(err)
    }
}

exports.handleBadRequestErrors = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ msg: `bad request, incorrect datatype was used`})
    } else {
        next(err);
    }
}

exports.handleForeignKeyViolationsErrors = (err, req, res, next) => {
    if (err.code === "23503") {
        res.status(400).send({ msg: "foreign key value does not correspond to any entity id"})
    } else {
        next(err);
    }
}

exports.handleAssignNullToNonNullErrors = (err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: `bad request, missing value in request`})
    } else {
        next(err);
    }
}

exports.handleMissingColumnErrors = (err, req, res, next) => {
    if (err.code === "42703") {
        res.status(400).send({ msg: `column does not exist`})
    } else {
        next(err);
    }
}

exports.handleSQLSyntaxErrors = (err, req, res, next) => {
    if (err.code === "42601") {
        res.status(400).send({ msg: `Incorrect data was entered`})
    } else {
        next(err);
    }
}