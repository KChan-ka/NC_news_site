const db = require("../db/connection");

exports.selectUsers = () => {

    const queryString = `SELECT username, name, avatar_url FROM users`

    return db
        .query(queryString)
        .then(({ rows }) => {
            return rows;
        });
};


exports.selectUserByUsername = (username) => {

    const queryString = `
    SELECT username, name, avatar_url 
    FROM users
    WHERE username = $1`

    return db
        .query(queryString, [username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no data found" });
            }
            else {
                return rows[0];
            }
        });
};