const db = require("../db/connection");

exports.checkIfArticleIdExist = (articleId) => {
    return db.query(`SELECT article_id FROM articles WHERE article_id = $1`, [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return false
            }
            else {
                return true
            }
        })
}