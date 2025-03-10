const db = require("../db/connection");
const format = require("pg-format");

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

exports.selectArticles = () => {

    const queryString = `
    SELECT 
        a.author,
        a.title,
        a.article_id,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url,
        count(c.body) as comment_count
    FROM articles a
        JOIN comments c ON a.article_id = c.article_id
    GROUP BY
        a.author,
        a.title,
        a.article_id,
        a.topic,
        a.created_at,
        a.votes,
        a.article_img_url
    ORDER BY a.created_at DESC`

    return db
        .query(queryString)
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no data found" });
            }
            else {
                return rows;
            }
        });
};


