const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const app = require('../app.js');
const request = require('supertest');
const jestSorted = require('jest-sorted')

beforeEach(() => {
  return seed(data);
})

afterAll(() => {
  return db.end();
})

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("inexistent endpoint test", () => {
  test("test non existent endpoint", () => {
    return request(app)
      .get('/api/random')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("endpoint doesn't exist")
      })
  })
})

describe("/api/topics", () => {
  test("200: retrieves all topics from topics table", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body: {topics} }) => {
        //ensure that this returns the correct number of rows
        expect(topics.length).toBe(3)

        topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string")
          expect(typeof topic.description).toBe("string")
        })
      })
  })
})

describe("/api/articles/:article_id", () => {
  test("200: retrieves article from articles table", () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body }) => {
        const article = body.article

        const expectedArticle = {
          article_id: 1,
          title: 'Living in the shadow of a great man',
          topic: 'mitch',
          author: 'butter_bridge',
          body: 'I find this existence challenging',
          created_at: '2020-07-09T20:11:00.000Z',
          votes: 100,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }

        expect(article).toMatchObject(expectedArticle)
      })
  })
  test("404: error when retrieving non existent article from articles table", () => {
    return request(app)
      .get('/api/articles/99')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no data found")
      })
  })

  test("400: error when passing invalid article_id", () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request, incorrect datatype was used")
      })
  })
})

describe("/api/articles", () => {
  test("200: retrieves all articles from articles table sorted by date in descending order", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body : {articles} }) => {
        //5 articles present in test db
        expect(articles.length).toBe(5)


        articles.forEach((article) => {
          expect(typeof article.author).toBe("string")
          expect(typeof article.title).toBe("string")
          expect(typeof article.article_id).toBe("number")
          expect(typeof article.topic).toBe("string")
          expect(typeof article.created_at).toBe("string")
          expect(typeof article.votes).toBe("number")
          expect(typeof article.article_img_url).toBe("string")
          expect(typeof article.comment_count).toBe("string")
        })


        //check it is sorted by date in desc order
        expect(articles).toBeSortedBy('created_at', { descending: true, })
      })
  })

  test("200: retrieves all articles from articles table sorted by title in asc order", () => {
    return request(app)
      .get('/api/articles?sort_by=title&order=asc')
      .expect(200)
      .then(({ body : {articles} }) => {
        expect(articles).toBeSortedBy('title', { ascending: true, })
      })
  })

  test("400: invalid column error", () => {
    return request(app)
      .get('/api/articles?sort_by=banana')
      .expect(400)
      .then(({ body : {msg} }) => {
        expect(msg).toBe("column does not exist")
      })
  })

  test("400: invalid order parameter", () => {
    return request(app)
      .get('/api/articles?order=banana')
      .expect(400)
      .then(({ body : {msg} }) => {
        expect(msg).toBe("SQL syntax error")
      })
  })
})

describe("/api/articles/:article_id/comments", () => {
  test("200: retrieves all comments by articleId sorted by date in descending order", () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body : {comments} }) => {
        //5 articles present in test db
        expect(comments.length).toBe(2)

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number")
          expect(typeof comment.votes).toBe("number")
          expect(typeof comment.created_at).toBe("string")
          expect(typeof comment.author).toBe("string")
          expect(typeof comment.body).toBe("string")
          expect(comment.article_id).toBe(3)
        })

        //check it is sorted by date in desc order
        expect(comments).toBeSortedBy('created_at', { descending: true, })
      })
  })

  test("404: error when no article id is found", () => {
    return request(app)
      .get('/api/articles/37/comments')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no data found")
      })
  })

  test("400: error when passing invalid article_id", () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request, incorrect datatype was used")
      })
  })
})

describe("POST: /api/articles/:article_id/comments", () => {
  test("201: save one comment to article id", () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: "icellusedkars",
        body: "test body"
      })
      .expect(201)
      .then(({ body : {comment} }) => {
        expect(comment.comment_id).toBe(19)
        expect(comment.article_id).toBe(1)
        expect(comment.body).toBe("test body")
        expect(comment.votes).toBe(0)
        expect(comment.author).toBe("icellusedkars")

      })
  })

  test("201: save one comment to article id with unnecessary properties", () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: "icellusedkars",
        body: "test body",
        votes: 123
      })
      .expect(201)
      .then(({ body: {comment} }) => {
        expect(comment.comment_id).toBe(19)
        expect(comment.article_id).toBe(1)
        expect(comment.body).toBe("test body")
        expect(comment.votes).toBe(0)
        expect(comment.author).toBe("icellusedkars")

      })
  })

  test("400: error message is returned when author does not exist", () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: "test user",
        body: "test body"
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Key (author)=(test user) is not present in table "users".`)

      })
  })

  test("400: error message is returned when misssing necessary fields", () => {
    return request(app)
      .post('/api/articles/1/comments')
      .send({
        username: "icellusedkars",
        votes: 24
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`insert or update on table violates foreign key constraint`)

      })
  })

  test("400: error message is returned when article id does not exist", () => {
    return request(app)
      .post('/api/articles/125/comments')
      .send({
        username: "icellusedkars",
        body: "test body"
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`Key (article_id)=(125) is not present in table \"articles\".`)

      })
  })

  test("400: error message is returned when invalid articleid", () => {
    return request(app)
      .post('/api/articles/katherine/comments')
      .send({
        username: "icellusedkars",
        body: "test body"
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe('bad request, incorrect datatype was used')

      })
  })
})


describe("PATCH: /api/articles/:article_id", () => {
  test("200: patch one article successfully", () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: -18
      })
      .expect(200)
      .then(({ body: {article} }) => {
        expect(article.votes).toBe(82)

      })
  })

  test("404: error message is returned when article does not exist", () => {
    return request(app)
      .patch('/api/articles/999')
      .send({
        inc_votes: 15
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`no article id found`)

      })
  })

  test("400: bad formed article_id", () => {
    return request(app)
      .patch('/api/articles/banana')
      .send({
        inc_votes: 15
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request, incorrect datatype was used")

      })
  })

  test("400: invalid inc_votes", () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: "banana"
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request, incorrect datatype was used")

      })
  })
})

describe("DELETE: /api/comments/:comment_id", () => {
  test("204: delete one comment successfully", () => {
    return request(app)
      .delete('/api/comments/4')
      .expect(204)
      .then(() => {
        return db.query(`SELECT comment_id FROM comments WHERE comment_id = $1`, [4])
          .then(({ rows }) => {
            expect(rows.length).toBe(0)
          })
      })
  })

  test("404: comment id not found", () => {
    return request(app)
      .delete('/api/comments/476')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("comment id not found")
      })
  })

  test("400: comment id not valid", () => {
    return request(app)
      .delete('/api/comments/banana')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request, incorrect datatype was used")
      })
  })
})


describe("GET: /api/users", () => {
  test("200: retrieves all users from users table", () => {
    return request(app)
      .get('/api/users')
      .expect(200)
      .then(({ body: {users} }) => {
        //ensure that this returns the correct number of rows
        expect(users.length).toBe(4)

        users.forEach((user) => {
          expect(typeof user.username).toBe("string")
          expect(typeof user.name).toBe("string")
          expect(typeof user.avatar_url).toBe("string")
        })
      })
  })
})


