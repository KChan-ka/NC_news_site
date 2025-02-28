const db = require("../connection")
const data = require('../data/test-data/index');
const format = require("pg-format");
const {
  convertTimestampToDate,
  createReferenceObj
} = require("./utils");


const seed = async ({ topicData, userData, articleData, commentData }) => {
  //dropping tables if exist and creating them
  await dropTables();
  await createTables();

  //inserting the data into tables
  await insertTableTopic(topicData);
  await insertTableUsers(userData);
  const rowsInsertedIntoArticles = await insertTableArticles(articleData);
  await insertTableComments(commentData, rowsInsertedIntoArticles);
};


async function dropTables() {
  await db.query(`DROP TABLE IF EXISTS comments`)
  await db.query(`DROP TABLE IF EXISTS articles`)
  await db.query(`DROP TABLE IF EXISTS users`)
  await db.query(`DROP TABLE IF EXISTS topics`)
}

async function createTables() {
  await createTableTopics();
  await createTableUsers();
  await createTableArticles();
  await createTableComments();
}


async function createTableTopics() {
  await db.query(`
    CREATE TABLE topics (
      slug_id SERIAL,
      slug VARCHAR(100) PRIMARY KEY,
      description VARCHAR(200),
      img_url VARCHAR(1000)
    );
  `)
}

async function createTableUsers() {
  await db.query(`
    CREATE TABLE users (
      user_id SERIAL,
      username VARCHAR(100) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      avatar_url VARCHAR(1000)
    );
  `)
}

async function createTableArticles() {
  await db.query(`
    CREATE TABLE articles (
      article_id SERIAL PRIMARY KEY,
      title VARCHAR(100),
      topic VARCHAR(100) REFERENCES topics(slug),
      author VARCHAR(100) REFERENCES users(username),
      body TEXT,
      created_at TIMESTAMP NOT NULL DEFAULT NOW(),
      votes INT DEFAULT 0,
      article_img_url VARCHAR(1000)
    );
  `)
}

async function createTableComments() {
  await db.query(`
    CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      article_id INT REFERENCES articles(article_id),
      body TEXT,
      votes INT DEFAULT 0,
      author VARCHAR(100) REFERENCES users(username),
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
  `)
}

async function insertTableTopic(topicData) {

  //convert to nested array prior to using format
  const formattedData = topicData.map((topic) => {
    return [
      topic.slug,
      topic.description,
      topic.img_url
    ]
  })

  //generate the INSERT formatted line
  const insertIntoString = format('INSERT INTO topics (slug, description, img_url) VALUES %L RETURNING *', formattedData)

  //perform insert into
  await db.query(insertIntoString)
    .then(({ rows }) => {
      console.log(rows, " <<< has been inserted to topics table")
    })
}

async function insertTableUsers(userData) {

  //convert to nested array prior to using format
  const formattedData = userData.map((user) => {
    return [
      user.username,
      user.name,
      user.avatar_url
    ]
  })

  //generate the INSERT formatted line
  const insertIntoString = format('INSERT INTO users (username, name, avatar_url) VALUES %L RETURNING *', formattedData)

  //perform insert into
  await db.query(insertIntoString)
    .then(({ rows }) => {
      console.log(rows, " <<< has been inserted to users table")
    })
}

async function insertTableArticles(articlesData) {

  //convert to nested array prior to using format
  const formattedData = articlesData.map((article) => {
    //format the dates
    const dbDate = convertTimestampToDate({ created_at: article.created_at })
    return [
      article.title,
      article.topic,
      article.author,
      article.body,
      dbDate.created_at,
      article.article_img_url
    ]
  })

  //generate the INSERT formatted line
  const insertIntoString = format('INSERT INTO articles (title, topic, author, body, created_at, article_img_url) VALUES %L RETURNING *', formattedData)

  //perform insert into
  const output = await db.query(insertIntoString)
  console.log(output.rows, " <<< has been inserted to articles table")
  return output.rows
}

async function insertTableComments(commentData, rowsInsertedIntoArticles) {

  //create mapping object to fill in IDs
  const articleMappingObj = createReferenceObj(rowsInsertedIntoArticles, "title", "article_id")
  
  //convert to nested array prior to using format
  const formattedData = commentData.map((comment) => {

    //format the dates
    const dbDate = convertTimestampToDate({ created_at: comment.created_at })
    return [
      articleMappingObj[comment.article_title],
      comment.body,
      comment.votes,
      comment.author,
      dbDate.created_at
    ]
  })

  //generate the INSERT formatted line
  const insertIntoString = format('INSERT INTO comments (article_id, body, votes, author, created_at) VALUES %L RETURNING *', formattedData)

  //perform insert into
  await db.query(insertIntoString)
    .then(({ rows }) => {
      console.log(rows, " <<< has been inserted to comments table")
    })
}

module.exports = seed;
