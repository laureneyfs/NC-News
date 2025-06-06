const endpointsJson = require("../endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const app = require("../app");

beforeEach(() => seed(data));
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
  test("200: Responds with an object of the articles table from our database, sorted by created_at, descending", () => {
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
        const arrayCopy = [...createdAtArray];
        expect(arrayCopy.sort().reverse()).toEqual(createdAtArray);
      });
  });
  test("200: Responds with an object of the articles table organised by the field specified in the sort_by query", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then(({ body }) => {
        const createdAtArray = [];
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(typeof article.topic).toBe("string");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          createdAtArray.push(article.article_id);
        });
        const arrayCopy = [...createdAtArray];
        expect(
          arrayCopy.sort(function (a, b) {
            return b - a;
          })
        ).toEqual(createdAtArray);
      });
  });
  test("400: responds with an error if given a sort_by query value that isn't a column on our table", () => {
    return request(app)
      .get("/api/articles?sort_by=invalidquery")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("200: when given order query with no sort_by query, orders the table by created_at and orders the table appropriately", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then(({ body }) => {
        const createdAtArray = [];
        expect(body.articles.length).not.toBe(0);
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
        const arrayCopy = [...createdAtArray];
        expect(arrayCopy.sort()).toEqual(createdAtArray);
      });
  });
  test("400: responds with an error if given an order query value that isn't 'asc' or 'desc'", () => {
    return request(app)
      .get("/api/articles?order=invalidquery")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("200: Responds with articles filtered by topic when given a valid topic query", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article.hasOwnProperty("comment_count")).toBe(true);
        });
      });
  });
  test("400: responds with an error if given a topic query value that isn't present in the slugs column on our topic table", () => {
    return request(app)
      .get("/api/articles?topic=invalidtopic")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });

  test("200: topic, sort_by and order queries will all be accounted for when used together", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        const createdAtArray = [];
        expect(body.articles.length).not.toBe(0);
        body.articles.forEach((article) => {
          expect(typeof article.author).toBe("string");
          expect(typeof article.title).toBe("string");
          expect(typeof article.article_id).toBe("number");
          expect(article.topic).toBe("mitch");
          expect(typeof article.created_at).toBe("string");
          expect(typeof article.votes).toBe("number");
          expect(typeof article.article_img_url).toBe("string");
          expect(article.hasOwnProperty("comment_count")).toBe(true);
          createdAtArray.push(article.article_id);
        });
        const arrayCopy = [...createdAtArray];
        expect(
          arrayCopy.sort(function (a, b) {
            return a - b;
          })
        ).toEqual(createdAtArray);
      });
  });
  // test("400: responds with an error if endpoint is queried with an invalid query", () => {
  //   return request(app)
  //     .get("/api/articles?invalidquery=yes")
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).toBe("bad request");
  //     });
  // });
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
  test("200: GET /api/articles/:article_id has a comment_count field", () => {
    return request(app)
      .get("/api/articles/2")
      .expect(200)
      .then(({ body }) => {
        const { comment_count } = body.article;
        expect(typeof comment_count).toBe("number");
      });
  });
  test("404: Responds with an error message if user_id doesn't exist in our users table", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
  test("400: Responds with an error message if user_id provided is not a number", () => {
    return request(app)
      .get("/api/articles/test")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
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
  test("404: responds with an error message if article_id provided is not in our article table", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
  test("400: responds with an error message if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/notanumber/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("200: responds with an empty array if article_id is valid but the article has no comments", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const commentsArray = response.body.comments;
        expect(commentsArray.length).toBe(0);
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
  test("400: returns error message if article_id is not a number", () => {
    const data = { username: "icellusedkars", body: "test test" };
    return request(app)
      .post("/api/articles/notanum/comments")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("404: returns error message if trying to POST to an invalid article_id", () => {
    const data = { username: "icellusedkars", body: "test test" };
    return request(app)
      .post("/api/articles/100/comments")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
  test("404: returns error message if query has a foreign key violation", () => {
    const data = { username: "terryhintz", body: "test test" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });

  test("400: returns error message if query is missing required fields", () => {
    const data = { username: "icellusedkars" };
    return request(app)
      .post("/api/articles/1/comments")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });

  // test("400: returns error message if fields provided have a typing mismatch", () => {
  //   const data = { username: "icellusedkars", body: 3 };
  //   return request(app)
  //     .post("/api/articles/1/comments")
  //     .send(data)
  //     .expect(400)
  //     .then(({ body }) => {
  //       expect(body.error).toBe("bad request");
  //     });
  // });
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

  test("400: Returns error message if posted data has a foreign key violation", () => {
    const data = { inc_votes: "notanum" };
    request(app)
      .patch("/api/articles/1")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("400: returns error message if posted data does not have a inc_votes key", () => {
    const data = {};
    request(app)
      .patch("/api/articles/1")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("404: Returns error message if article_id provided isn't on our table", () => {
    const data = { inc_votes: 3 };
    request(app)
      .patch("/api/articles/100")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment that corresponds to comment_id + returns confirmation string", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: returns an error if comment_id is not present on our comments table", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("comment not found");
      });
  });
  test("400: returns an error if comment_id is not a number", () => {
    return request(app).delete("/api/comments/notanum").expect(400);
  });
});
