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

exports.selectCommentsByArticleId = (articleId, limit = 10, page = 1) => {



    let queryString = `
    SELECT
    comment_id,
        votes,
        created_at,
        author,
        body,
        article_id
    FROM comments
    WHERE article_id = $1
    ORDER BY created_at DESC
    LIMIT ${limit} `

    if (page !== 1) {
        const offsetValue = limit * (page - 1)
        queryString += `OFFSET ${offsetValue}`
    }

    return db
        .query(queryString, [articleId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no data found" });
            }
            else {
                return rows;
            }
        });
};

exports.insertCommentByArticleId = async (articleId, author, body) => {

    const queryString = `
    INSERT INTO comments
        (article_id, author, body)
    VALUES
        ($1, $2, $3)
    RETURNING * `

    return db
        .query(queryString, [articleId, author, body])
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.updateCommentByCommentId = async (commentId, incVotes) => {

    //check if comment id exist
    const commentIdExists = await this.checkIfCommentIdExist(commentId)
    if (!commentIdExists) {
        return Promise.reject({ status: 404, msg: "no comment found" });
    }

    const queryString = `
    UPDATE comments
    SET votes = votes + ($1) 
    WHERE comment_id = $2
    RETURNING * `

    return db
        .query(queryString, [incVotes, commentId])
        .then(({ rows }) => {
            return rows[0];
        });
};

exports.deleteCommentByCommentId = (commentId) => {

    const queryString = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING * `

    return db
        .query(queryString, [commentId])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "comment id not found" });
            }
        });
};
