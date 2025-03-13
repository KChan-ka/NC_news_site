const db = require("../db/connection");

exports.selectTopics = () => {

    const queryString = `SELECT slug, description FROM topics`

    return db
        .query(queryString)
        .then(({ rows }) => {
            return rows;
        });
};

exports.insertTopic = (slug, description) => {

    const queryString = `
    INSERT INTO topics
        (slug, description)
    VALUES
        ($1, $2)
    RETURNING * `

    return db.query(queryString, [slug, description])
        .then(({ rows }) => {
            return rows[0]
        })
};