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

describe("GET: /api/articles", () => {
    test("200: retrieves all articles from articles table sorted by date in descending order", () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10)
  
  
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
  
  
          expect(articles).toBeSortedBy('created_at', { descending: true, })
        })
    })
  
    test("200: retrieves all articles from articles table sorted by title in asc order", () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=asc')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy('title', { ascending: true, })
        })
    })
  
    test("400: invalid column error", () => {
      return request(app)
        .get('/api/articles?sort_by=banana')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("incorrect parameter entered")
        })
    })
  
    test("400: invalid order parameter", () => {
      return request(app)
        .get('/api/articles?order=banana')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Incorrect data was entered")
        })
    })
  
    test("200: retrieves all articles from articles table filtered by topic", () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=asc&topic=mitch')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(10)
  
          articles.forEach((article) => {
            expect(typeof article.author).toBe("string")
            expect(typeof article.title).toBe("string")
            expect(typeof article.article_id).toBe("number")
            expect(article.topic).toBe("mitch")
            expect(typeof article.created_at).toBe("string")
            expect(typeof article.votes).toBe("number")
            expect(typeof article.article_img_url).toBe("string")
            expect(typeof article.comment_count).toBe("string")
          })
        })
    })
  
    test("200: invalid topic, returns nothing", () => {
      return request(app)
        .get('/api/articles?sort_by=title&order=asc&topic=banana')
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toBe(0)
  
        })
    })
  
    test("200: pagination test, test limit", () => {
      return request(app)
        .get('/api/articles?limit=9')
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(9)
  
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
        })
    })
  
    test("200: pagination test, test page", () => {
      return request(app)
        .get('/api/articles?p=2')
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(3)  
        })
    })

    test("200: pagination test, test page and limit", () => {
      return request(app)
        .get('/api/articles?limit=9&p=2')
        .expect(200)
        .then(({ body: { articles, total_count } }) => {
          expect(total_count).toBe(4)  
        })
    })
  
    test("400: pagination test, invalid limit", () => {
      return request(app)
        .get('/api/articles?limit=test')
        .expect(400)
        .then(({ body: { msg } }) => {
  
          expect(msg).toBe("incorrect parameter entered")
  
        })
    })
    test("400: pagination test, invalid page", () => {
      return request(app)
        .get('/api/articles?p=banana')
        .expect(400)
        .then(({ body: { msg } }) => {
  
          expect(msg).toBe("incorrect parameter entered")
  
        })
    })
})

describe("GET: /api/articles/:article_id", () => {
  test("200: retrieves article from articles table", () => {
    return request(app)
      .get('/api/articles/1')
      .expect(200)
      .then(({ body: { article } }) => {

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

describe("PATCH: /api/articles/:article_id", () => {
  test("200: patch one article successfully", () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: 22
      })
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.votes).toBe(122)
      })
  })

  test("200: patch one article successfully using substraction", () => {
    return request(app)
      .patch('/api/articles/1')
      .send({
        inc_votes: -18
      })
      .expect(200)
      .then(({ body: { article } }) => {
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
        expect(msg).toBe(`no article found`)

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

describe("POST: /api/articles", () => {
  test("201: save one article", () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: "butter_bridge",
        title: "Test title",
        topic: "mitch",
        body: "Test body",
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(14)
        expect(article.title).toBe("Test title")
        expect(article.topic).toBe("mitch")
        expect(article.author).toBe("butter_bridge")
        expect(article.body).toBe("Test body")
        expect(typeof article.created_at).toBe("string")
        expect(article.votes).toBe(0)
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        expect(article.comment_count).toBe("0")
      })
  })

  test("201: save article with unnecessary properties", () => {
    return request(app)
      .post('/api/articles')
      .send({
        author: "butter_bridge",
        title: "Test title",
        topic: "mitch",
        body: "Test body",
        fruit: "banana"
      })
      .expect(201)
      .then(({ body: { article } }) => {
        expect(article.article_id).toBe(14)
        expect(article.title).toBe("Test title")
        expect(article.topic).toBe("mitch")
        expect(article.author).toBe("butter_bridge")
        expect(article.body).toBe("Test body")
        expect(typeof article.created_at).toBe("string")
        expect(article.votes).toBe(0)
        expect(article.article_img_url).toBe("https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700")
        expect(article.comment_count).toBe("0")
      })
  })

  test("400: error message is returned when missing fields", () => {
    return request(app)
      .post('/api/articles')
      .send({
        title: "Test title",
        topic: "mitch",
        body: "Test body",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(`bad request, missing value in request`)

      })
  })
})

describe("DELETE: /api/articles/:article_id", () => {
    test("204: delete one article successfully", () => {
      return request(app)
        .delete('/api/articles/11')
        .expect(204)
        .then(() => {
          return db.query(`SELECT article_id FROM articles WHERE article_id = 11`).then((rows) => {
            expect(rows.length).toBe(undefined)
          })
        })
    })
  
    test("400: attempt to delete article with comments", () => {
      return request(app)
        .delete('/api/articles/1')
        .expect(400)
        .then(({body: {msg}}) => {
          expect(msg).toBe("foreign key violation, incorrect data entered")
        })
    })
  
    test("404: error message is returned when article does not exist", () => {
      return request(app)
        .delete('/api/articles/999')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`no article found`)
  
        })
    })
  
    test("400: bad formed article_id", () => {
      return request(app)
        .delete('/api/articles/banana')
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("bad request, incorrect datatype was used")
  
        })
    })
})