const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const db = require("../db/connection")
const seed = require("../db/seeds/seed")
const data = require("../db/data/test-data")
const app = require('../app.js');
const request = require('supertest');
// const jestSorted = require('jest-sorted')



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

