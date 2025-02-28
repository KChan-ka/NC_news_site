const db = require('./db/connection');
const seed = require('./db/seeds/seed');
const data = require('./db/data/development-data/index');


async function testSelects() {
    await seed(data)
    console.log("Database seed process has been completed")

    //get all of the users
    await db.query(`SELECT * FROM users;`)
        .then(({ rows }) => {
            console.log(rows, "<< get all of the users")
        })

    //Get all of the articles where the topic is coding
    await db.query(`SELECT * FROM articles WHERE topic = 'coding';`)
        .then(({ rows }) => {
            console.log(rows, "<< Get all of the articles where the topic is coding")
        })

    //Get all of the comments where the votes are less than zero
    await db.query(`SELECT * FROM comments WHERE votes < 0;`)
        .then(({ rows }) => {
            console.log(rows, "<< Get all of the comments where the votes are less than zero")
        })

    //Get all of the topics
    await db.query(`SELECT * FROM topics;`)
        .then(({ rows }) => {
            console.log(rows, "<< Get all of the topics")
        })

    //Get all of the articles by user grumpy19
    await db.query(`SELECT * FROM articles WHERE author = 'grumpy19';`)
        .then(({ rows }) => {
            console.log(rows, "<< Get all of the articles by user grumpy19")
        })

    //Get all of the comments that have more than 10 votes.
    await db.query(`SELECT * FROM comments WHERE votes > 10;`)
        .then(({ rows }) => {
            console.log(rows, "<< Get all of the comments that have more than 10 votes.")
        })
}

//test the selects in dev database
testSelects().then(() => db.end());





