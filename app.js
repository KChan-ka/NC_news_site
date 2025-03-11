//**************************************************************
//all requires
//**************************************************************

const express = require("express");
const app = express();

const {
    handleEmptyDataErrors,
    handleBadRequestErrors,
    handleForeignKeyViolationsErrors,
    handleAssignNullToNonNullErrors,
    handleMissingColumnErrors,
    handleSQLSyntaxErrors,
} = require("./controller/error-controller")

const {
    fetchAllAPi,
    fetchTopics,
    fetchUsers,
    fetchArticleById,
    fetchArticles,   
    fetchCommentsByArticleId, 
    postCommentByArticleId,
    patchArticleByArticleId,
    deleteCommentByCommentId,
} = require('./controller/controller')

//-*************************************************************

app.use(express.json());


// API methods

app.get("/api", fetchAllAPi)

app.get("/api/topics", fetchTopics)

app.get("/api/users", fetchUsers)

app.get("/api/articles/:article_id", fetchArticleById)

app.get("/api/articles", fetchArticles)

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)

app.patch("/api/articles/:article_id", patchArticleByArticleId)

app.delete("/api/comments/:comment_id", deleteCommentByCommentId)


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