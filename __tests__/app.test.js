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
  test("200: Responds with an object of the topics table from our database", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).not.toBe(0);
        body.topics.forEach((topic) => {
          expect(typeof topic.slug).toBe("string");
          expect(typeof topic.description).toBe("string");
          expect(topic.hasOwnProperty("img_url")).toBe(true);
        });
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an object of the articles table from our database", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        const createdAtArray = [];
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          createdAtArray.push(article.created_at);
        });
        const sortedCreatedAtArray = createdAtArray.sort().reverse();
        expect(sortedCreatedAtArray).toEqual(createdAtArray);
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an object of the users table from our database", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).not.toBe(0);
        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(user.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an object of the user that has the requested user_id from our users table", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then((response) => {
        const {
          author,
          title,
          article_id,
          body,
          topic,
          created_at,
          votes,
          article_img_url,
        } = response.body.article;

        expect(typeof author).toBe("string");
        expect(typeof title).toBe("string");
        expect(article_id).toBe(2);
        expect(typeof body).toBe("string");
        expect(typeof topic).toBe("string");
        expect(typeof created_at).toBe("string");
        expect(typeof votes).toBe("number");
        expect(typeof article_img_url).toBe("string");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of the comments on the article requested", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((response) => {
        const commentsArray = response.body.comments;
        expect(commentsArray.length).not.toBe(0);
        commentsArray.forEach((comment) => {
          const { comment_id, votes, created_at, author, body, article_id } =
            comment;
          expect(typeof comment_id).toBe("number");
          expect(typeof votes).toBe("number");
          expect(typeof created_at).toBe("string");
          expect(typeof author).toBe("string");
          expect(typeof body).toBe("string");
          expect(article_id).toBe(1);
        });
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: POSTs valid data and Returns POSTed object", () => {
    const data = { username: "icellusedkars", body: "test test" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(data)
      .expect(201)
      .then((response) => {
        const { comment_id, article_id, body, votes, author, created_at } =
          response.body.newComment;

        expect(typeof comment_id).toBe("number");
        expect(article_id).toBe(1);
        expect(body).toBe("test test");
        expect(votes).toBe(0);
        expect(author).toBe("icellusedkars");
        expect(typeof created_at).toBe("string");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Returns updated object of the updated fields of the article requested", async () => {
    const data = { inc_votes: -10 };
    const before = await request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        return body.article.votes;
      });
    const after = await request(app)
      .patch("/api/articles/1")
      .send(data)
      .expect(200)
      .then(({ body }) => {
        return body.adjustedArticle.votes;
      });

    expect(after + 10).toBe(before);
  });
});
