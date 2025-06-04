const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const app = require("../app");
/* Set up your test imports here */

/* Set up your beforeEach & afterAll functions here */
beforeAll(() => seed(data));
afterAll(() => db.end());

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

describe("GET /api/topics", () => {
  test.only("200: Responds with an object of the topics table from our database", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        console.log(body, "<== body");
        console.log(body.topics);
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
          expect(topic.hasOwnProperty("img_url")).toBe(true);
        });
      });
  });
});
