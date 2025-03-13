const endpointsJson = require("../endpoints.json");
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

describe("GET: /api/articles/:article_id/comments", () => {
  test("200: retrieves all comments by articleId sorted by date in descending order", () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body: { comments } }) => {
        expect(comments.length).toBe(2)

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number")
          expect(typeof comment.votes).toBe("number")
          expect(typeof comment.created_at).toBe("string")
          expect(typeof comment.author).toBe("string")
          expect(typeof comment.body).toBe("string")
          expect(comment.article_id).toBe(3)
        })

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

  test("200: pagination test limit", () => {
    return request(app)
      .get('/api/articles/3/comments?limit=1')
      .expect(200)
      .then(({ body: { comments, totalCount } }) => {
        expect(totalCount).toBe(1)

        expect(typeof comments[0].comment_id).toBe("number")
        expect(typeof comments[0].votes).toBe("number")
        expect(typeof comments[0].created_at).toBe("string")
        expect(typeof comments[0].author).toBe("string")
        expect(typeof comments[0].body).toBe("string")
        expect(comments[0].article_id).toBe(3)
      })
  })

  test("200: pagination test page", () => {
    return request(app)
      .get('/api/articles/3/comments?limit=1&p=2')
      .expect(200)
      .then(({ body: { comments, totalCount } }) => {
        expect(totalCount).toBe(1)

        expect(typeof comments[0].comment_id).toBe("number")
        expect(typeof comments[0].votes).toBe("number")
        expect(typeof comments[0].created_at).toBe("string")
        expect(typeof comments[0].author).toBe("string")
        expect(typeof comments[0].body).toBe("string")
        expect(comments[0].article_id).toBe(3)
      })
  })

  test("400: pagination test invalid limit", () => {
    return request(app)
      .get('/api/articles/3/comments?limit=banana&p=2')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("incorrect parameter entered")
      })
  })

  test("400: pagination test invalid page", () => {
    return request(app)
      .get('/api/articles/3/comments?limit=1&p=banana')
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("incorrect parameter entered")
      })
  })

  test("404: pagination test no results being returned", () => {
    return request(app)
      .get('/api/articles/3/comments?limit=11&p=5')
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("no data found")
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
      .then(({ body: { comment } }) => {
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
      .then(({ body: { comment } }) => {
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
        expect(msg).toBe(`foreign key violation, incorrect data entered`)

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
        expect(msg).toBe(`bad request, missing value in request`)

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
        expect(msg).toBe(`foreign key violation, incorrect data entered`)

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

describe("PATCH: /api/comments/:comment_id", () => {
  test("200: patch one comment successfully", () => {
    return request(app)
      .patch('/api/comments/1')
      .send({
        inc_votes: 15
      })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(31)
      })
  })

  test("200: patch one comment successfully using substraction", () => {
    return request(app)
      .patch('/api/comments/1')
      .send({
        inc_votes: -18
      })
      .expect(200)
      .then(({ body: { comment } }) => {
        expect(comment.votes).toBe(-2)
      })
  })

  test("404: error message is returned when comment does not exist", () => {
    return request(app)
      .patch('/api/comments/999')
      .send({
        inc_votes: 15
      })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`no comment found`)

      })
  })

  test("400: bad formed comment id", () => {
    return request(app)
      .patch('/api/comments/banana')
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
      .patch('/api/comments/1')
      .send({
        inc_votes: "banana"
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("bad request, incorrect datatype was used")

      })
  })
})