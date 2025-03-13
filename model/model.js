const db = require("../db/connection");
const {
    checkIfArticleIdExist,
} = require("./model.articles")

const {
    checkIfCommentIdExist,
} = require("./model.comments")


exports.selectTopics = () => {

    const queryString = `SELECT slug, description FROM topics`

    return db
        .query(queryString)
        .then(({ rows }) => {
            return rows;
        });
};

exports.selectArticleById = (articleId, isCommentCount = false) => {

    let queryString = ""

    if (!isCommentCount) {
        queryString = `SELECT * FROM articles WHERE article_id = $1`
    } else {
        queryString = `
        SELECT 
            a.author,
            a.title,
            a.article_id,
            a.topic,
            a.body,
            a.created_at,
            a.votes,
            a.article_img_url,
            count(c.body) as comment_count
        FROM articles a
            LEFT JOIN comments c ON a.article_id = c.article_id
        WHERE a.article_id = $1
        GROUP BY
            a.article_id`
    }

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

exports.selectArticles = (sort_by = "created_at", order = "desc", topic, limit = 10, page = 1) => {

    //building the SQL
    const queryParams = []
    let queryString = `
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
        LEFT JOIN comments c ON a.article_id = c.article_id `

    //if search by parameter, add WHERE
    if (topic) {
        queryParams.push(topic)
        queryString += `WHERE a.topic = $1`
    }

    //add sort_by and order
    queryString += `
    GROUP BY
        a.article_id 
    ORDER BY ${sort_by} ${order}
    LIMIT ${limit}  `

    //pagination
    //offsetValue is calculated with limit
    if (page !== 1) {
        const offsetValue = limit * (page - 1)
        queryString += `OFFSET ${offsetValue}`    }


    return db
        .query(queryString, queryParams)
        .then(({ rows }) => {
            return rows;
        });
};

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


exports.updateArticleByArticleId = async (articleId, incVotes) => {

    //check if article id exist
    const articleIdExists = await checkIfArticleIdExist(articleId)
    if (!articleIdExists) {
        return Promise.reject({ status: 404, msg: "no article found" });
    }

    const queryString = `
    UPDATE articles
    SET votes = votes + ($1) 
    WHERE article_id = $2
    RETURNING * `

    return db
        .query(queryString, [incVotes, articleId])
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
        .then(({rows}) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "comment id not found" });
            }
        });
};


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
        .query(queryString,[username])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: "no data found" });
            }
            else {
                return rows[0];
            }
        });
};

exports.updateCommentByCommentId = async (commentId, incVotes) => {

    //check if comment id exist
    const commentIdExists = await checkIfCommentIdExist(commentId)
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


exports.insertArticle = async (author, title, body, topic, articleImgUrl = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700") => {

    const queryString = `
    INSERT INTO articles
        (author, title, body, topic, article_img_url)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING * `

    const newArticle =  await db.query(queryString, [author, title, body, topic, articleImgUrl])
        .then( ({ rows }) => {
            return rows[0]
        })

    return await this.selectArticleById(newArticle.article_id, true)
};