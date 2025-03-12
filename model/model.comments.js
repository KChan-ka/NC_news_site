const db = require("../db/connection");

exports.checkIfCommentIdExist = (commentId) => {
    return db.query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [commentId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return false
            }
            else {
                return true
            }
        })
}