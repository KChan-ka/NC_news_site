//**************************************************************
//all requires
//**************************************************************

const express = require("express");
const app = express();

const {
    handleEmptyDataErrors,
    handleBadRequestErrors,
    handleForeignKeyViolationsErrors,
} = require("./controller/error-controller")

const {
    fetchAllAPi,
    fetchTopics,
    fetchArticleById,
    fetchArticles,   
    fetchCommentsByArticleId, 
    postCommentByArticleId,
} = require('./controller/controller')

//-*************************************************************

app.use(express.json());


// API methods

app.get("/api", fetchAllAPi)

app.get("/api/topics", fetchTopics)

app.get("/api/articles/:article_id", fetchArticleById)

app.get("/api/articles", fetchArticles)

app.get("/api/articles/:article_id/comments", fetchCommentsByArticleId)

app.post("/api/articles/:article_id/comments", postCommentByArticleId)


//error handing
app.use(handleEmptyDataErrors)

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