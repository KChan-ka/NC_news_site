//**************************************************************
//all requires
//**************************************************************

const express = require("express");
const app = express();
const apiRouter = require("./routes/api-router")

const {
    handleEmptyDataErrors,
    handleBadRequestErrors,
    handleForeignKeyViolationsErrors,
    handleAssignNullToNonNullErrors,
    handleMissingColumnErrors,
    handleSQLSyntaxErrors,
} = require("./controller/error-controller")

//-*************************************************************

app.use(express.json());

// API methods
app.use("/api", apiRouter);


//error handing
app.use(handleEmptyDataErrors)

app.use(handleSQLSyntaxErrors)

app.use(handleMissingColumnErrors)

app.use(handleAssignNullToNonNullErrors)

app.use(handleForeignKeyViolationsErrors)

app.use(handleBadRequestErrors)


//handle all the bad end points
app.all("*", (req, res) => {
    res.status(404).send({msg: "endpoint doesn't exist"})
})

//handle remaining errors
exports.handleServerErrors = (err, req, res) => {
    res.status(500).send("Internal server error")
}


module.exports = app