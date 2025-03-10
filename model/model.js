const db = require("../db/connection");
const format = require("pg-format");

// fetch data from topics table
exports.selectTopics = () => {

    const queryString = `SELECT slug, description FROM topics`

    return db
        .query(queryString)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no data found" });
            } 1
            return rows;
        });
};

// fetch data from topics table
exports.selectArticleById = (articleId) => {

    const queryString = `SELECT * FROM articles WHERE article_id = $1`

    return db
        .query(queryString, [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no data found" });
            }
            else {
                return rows[0];
            }
        });
};


