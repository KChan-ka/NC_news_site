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

describe("GET: /api/users", () => {
    test("200: retrieves all users from users table", () => {
      return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toBe(4)
  
          users.forEach((user) => {
            expect(typeof user.username).toBe("string")
            expect(typeof user.name).toBe("string")
            expect(typeof user.avatar_url).toBe("string")
          })
        })
    })
})
  
describe("GET: /api/users/:username", () => {
    test("200: retrieves user from users table", () => {
      return request(app)
        .get('/api/users/lurker')
        .expect(200)
        .then(({ body: { user } }) => {
          const expectedUser = {
            username: 'lurker',
            name: 'do_nothing',
            avatar_url: 'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png'
          }
          expect(user).toMatchObject(expectedUser)
        })
    })
    test("404: error when retrieving non user", () => {
      return request(app)
        .get('/api/users/randomuser')
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("no data found")
        })
    })
})
  
  