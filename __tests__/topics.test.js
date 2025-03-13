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

describe("GET: /api/topics", () => {
    test("200: retrieves all topics from topics table", () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toBe(3)
  
          topics.forEach((topic) => {
            expect(typeof topic.slug).toBe("string")
            expect(typeof topic.description).toBe("string")
          })
        })
    })
})

describe("POST: /api/topics", () => {
    test("201: save one topic", () => {
      return request(app)
        .post('/api/topics')
        .send({
          slug: "dogs",
          description: "not cats"
        })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic.slug_id).toBe(4)
          expect(topic.slug).toBe("dogs")
          expect(topic.description).toBe("not cats")
          expect(topic.img_url).toBe(null)
        })
    })
  
    test("201: save article with unnecessary properties", () => {
      return request(app)
        .post('/api/topics')
        .send({
          slug: "dogs",
          description: "not cats",
          topic: "mitch"
        })
        .expect(201)
        .then(({ body: { topic } }) => {
          expect(topic.slug_id).toBe(4)
          expect(topic.slug).toBe("dogs")
          expect(topic.description).toBe("not cats")
          expect(topic.img_url).toBe(null)
        })
    })
  
    test("400: error message is returned when missing fields", () => {
      return request(app)
        .post('/api/topics')
        .send({
          description: "not cats"
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(`bad request, missing value in request`)
  
        })
    })
})