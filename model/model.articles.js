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
        queryString += `OFFSET ${offsetValue}`
    }


    return db
        .query(queryString, queryParams)
        .then(({ rows }) => {
            return rows;
        });
};

exports.updateArticleByArticleId = async (articleId, incVotes) => {

    //check if article id exist
    const articleIdExists = await this.checkIfArticleIdExist(articleId)
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

exports.insertArticle = async (author, title, body, topic, articleImgUrl = "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700") => {

    const queryString = `
    INSERT INTO articles
        (author, title, body, topic, article_img_url)
    VALUES
        ($1, $2, $3, $4, $5)
    RETURNING * `

    const newArticle = await db.query(queryString, [author, title, body, topic, articleImgUrl])
        .then(({ rows }) => {
            return rows[0]
        })

    return await this.selectArticleById(newArticle.article_id, true)
};

exports.deleteArticle = async (articleId) => {

    //check if article id exist
    const articleIdExists = await this.checkIfArticleIdExist(articleId)
    if (!articleIdExists) {
        return Promise.reject({ status: 404, msg: "no article found" });
    }

    const queryString = `
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING *`

    return db.query(queryString, [articleId])
        .then(({ rows }) => {
            return rows[0]
        })
};