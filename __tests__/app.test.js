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
      .then(({ body }) => {
        const msg = body.msg
        expect(msg).toBe("endpoint doesn't exist")
      })
  })
})

describe("/api/topics", () => {
  test("200: retrieves all topics from topics table", () => {
    return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics
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
          votes: 0,
          article_img_url: 'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700'
        }

        expect(article).toMatchObject(expectedArticle)
      })
  })
  test("404: error when retrieving non existent article from articles table", () => {
    return request(app)
      .get('/api/articles/99')
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg
        expect(msg).toBe("no data found")
      })
  })

  test("400: error when passing invalid article_id", () => {
    return request(app)
      .get('/api/articles/banana')
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg
        expect(msg).toBe("bad request, incorrect datatype was used")
      })
  })
})

describe("/api/articles", () => {
  test("200: retrieves all articles from articles table sorted by date in descending order", () => {
    return request(app)
      .get('/api/articles')
      .expect(200)
      .then(({ body }) => {
        const articles = body.articles
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
})

describe("/api/articles/:article_id/comments", () => {
  test("200: retrieves all comments by articleId sorted by date in descending order", () => {
    return request(app)
      .get('/api/articles/3/comments')
      .expect(200)
      .then(({ body }) => {
        const comments = body.comments
        //5 articles present in test db
        expect(comments.length).toBe(2)

        comments.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number")
          expect(typeof comment.votes).toBe("number")
          expect(typeof comment.created_at).toBe("string")
          expect(typeof comment.author).toBe("string")
          expect(typeof comment.body).toBe("string")
          expect(typeof comment.article_id).toBe("number")
        })

        //check it is sorted by date in desc order
        expect(comments).toBeSortedBy('created_at', { descending: true, })
      })
  })

  test("404: error when no article id is found", () => {
    return request(app)
      .get('/api/articles/37/comments')
      .expect(404)
      .then(({ body }) => {
        const msg = body.msg
        expect(msg).toBe("no data found")
      })
  })

  test("400: error when passing invalid article_id", () => {
    return request(app)
      .get('/api/articles/banana/comments')
      .expect(400)
      .then(({ body }) => {
        const msg = body.msg
        expect(msg).toBe("bad request, incorrect datatype was used")
      })
  })
})