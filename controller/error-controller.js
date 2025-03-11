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
        res.status(400).send({ msg: err.detail})
    } else {
        next(err);
    }
}

exports.handleAssignNullToNonNullErrors = (err, req, res, next) => {
    if (err.code === "23502") {
        res.status(400).send({ msg: `insert or update on table violates foreign key constraint`})
    } else {
        next(err);
    }
}