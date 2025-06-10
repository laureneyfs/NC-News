const endpointsJson = require("../db/data/endpoints.json");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const data = require("../db/data/test-data/index");
const app = require("../app");

beforeEach(() => seed(data));
afterAll(() => db.end());

// describe("GET /api", () => {
//   test("200: Responds with an object detailing the documentation for each endpoint", () => {
//     return request(app)
//       .get("/api")
//       .expect(200)
//       .then(({ body: { endpoints } }) => {
//         expect(endpoints).toEqual(endpointsJson);
//       });
//   });
// });

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
  test("404: responds with an error if given a topic query value that isn't present in the slugs column on our topic table", () => {
    return request(app)
      .get("/api/articles?topic=invalidtopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
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
  test("200: limit query limits the length of results correctly", () => {
    return request(app)
      .get("/api/articles?limit=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles.length).toBe(2);
      });
  });
  test("200: p query offsets result response by the correct number (with respect to limits, defaulting to 10", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id&order=asc&p=2")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).toBe(11);
      });
  });
  test("200: when limit and p are queried together, p correctly adjusts the offset value", () => {
    return request(app)
      .get("/api/articles?limit=3&p=2&sort_by=article_id&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles[0].article_id).toBe(4);
        expect(body.articles.length).toBe(3);
      });
  });
  test("400: returns an error if limit query value is not a number", () => {
    return request(app)
      .get("/api/articles?limit=notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("400: returns an error if p query value is not a number above 0", () => {
    return request(app)
      .get("/api/articles?p=notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
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
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Returns updated object with the votes field adjusted as requested", async () => {
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
    return request(app)
      .patch("/api/articles/1")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("200: ignores irrelevant keys, and returns 200 with an unedited object when inc_votes is missing or 0 ", () => {
    const data = { test: "not an incvotes key" };
    return request(app).patch("/api/articles/1").send(data).expect(200);
  });

  test("404: Returns error message if article_id provided isn't on our table", () => {
    const data = { inc_votes: 3 };
    return request(app)
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

describe("GET /api/users/:username", () => {
  test("200: Returns user object of the user with the requested username", () => {
    return request(app)
      .get("/api/users/icellusedkars")
      .expect(200)
      .then(({ body }) => {
        const { username, name, avatar_url } = body.user;
        expect(username).toBe("icellusedkars");
        expect(typeof name).toBe("string");
        expect(typeof avatar_url).toBe("string");
      });
  });
  test("404: Returns an error if username is not present on our users table", () => {
    return request(app)
      .get("/api/users/invalidusername")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
});

describe("GET /api/comments/:comment_id", () => {
  test("200: returns requested comment", () => {
    return request(app)
      .get("/api/comments/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comment.comment_id).toBe(1);
      });
  });
  test("404: returns error if comment_id is not present on our comments table", () => {
    return request(app)
      .get("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
  test("400: returns error if invoked with a comment_id that is not a number", () => {
    return request(app)
      .get("/api/comments/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
});

describe("PATCH /api/comments/:comment_id", () => {
  test("200: Returns comment with votes field updated by the amount requested", () => {
    const data = { inc_votes: -5 };
    return request(app)
      .patch("/api/comments/1")
      .send(data)
      .expect(200)
      .then(({ body }) => {
        const { votes, comment_id, article_id, author, created_at } =
          body.updatedComment;
        expect(votes).toBe(11);
        expect(comment_id).toBe(1);
        expect(typeof article_id).toBe("number");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
      });
  });
  test("200: returns comment object with an unedited votecount if inc_votes key is missing and queried with irrelevant data", () => {
    const data = { test: "not an incvotes key" };
    return request(app)
      .patch("/api/comments/1")
      .send(data)
      .expect(200)
      .then(({ body }) => {
        const { votes, comment_id, article_id, author, created_at } =
          body.updatedComment;
        expect(votes).toBe(16);
        expect(comment_id).toBe(1);
        expect(typeof article_id).toBe("number");
        expect(typeof author).toBe("string");
        expect(typeof created_at).toBe("string");
      });
  });
  test("404: returns an error if attempting to patch a comment_id that does not exist on our comments table", () => {
    const data = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/100")
      .send(data)
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("not found");
      });
  });
  test("400: returns an error if attempting to patch a comment_id that is not a number", () => {
    const data = { inc_votes: -1 };
    return request(app)
      .patch("/api/comments/notanum")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
});

describe("POST /api/articles", () => {
  test("201: returns the created comment if all fields provided are valid within request", () => {
    const data = {
      author: "icellusedkars",
      title: "this is a test article",
      body: "this is an example body",
      topic: "mitch",
      article_img_url: "https://fakeimglink.com/",
    };

    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(201)
      .then((response) => {
        const {
          author,
          title,
          body,
          topic,
          article_img_url,
          votes,
          article_id,
          created_at,
        } = response.body.createdArticle;
        expect(author).toBe("icellusedkars");
        expect(typeof article_id).toBe("number");
        expect(title).toBe("this is a test article");
        expect(body).toBe("this is an example body");
        expect(topic).toBe("mitch");
        expect(article_img_url).toBe("https://fakeimglink.com/");
        expect(votes).toBe(0);
        expect(typeof created_at).toBe("string");
      });
  });
  test("400: returns error if missing required fields", () => {
    const data = {
      title: "this is a test article",
      body: "this is an example body",
      topic: "mitch",
      article_img_url: "https://fakeimglink.com/",
    };

    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("400: returns error if there is a foreign key violation", () => {
    const data = {
      username: "notarealusername",
      title: "this is a test article",
      body: "this is an example body",
      topic: "mitch",
      article_img_url: "https://fakeimglink.com/",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("201: returns request with a default avatar_img_url if none is provided", () => {
    const data = {
      author: "icellusedkars",
      title: "this is a test article",
      body: "this is an example body",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles")
      .send(data)
      .expect(201)
      .then(({ body }) => {
        expect(body.createdArticle.article_img_url).toBe(
          "https://i.natgeofe.com/n/548467d8-c5f1-4551-9f58-6817a8d2c45e/NationalGeographic_2572187_16x9.jpg?w=128"
        );
      });
  });
});

describe("POST /api/topics", () => {
  test("201: POSTs new topic to topic table when provided with valid data", () => {
    const data = { slug: "new topic", description: "example description" };
    return request(app)
      .post("/api/topics")
      .send(data)
      .expect(201)
      .then(({ body }) => {
        const { slug, description } = body.createdTopic;
        expect(slug).toBe("new topic");
        expect(description).toBe("example description");
      });
  });
  test("400: returns error if missing required fields", () => {
    const data = { description: "example description" };
    return request(app)
      .post("/api/topics")
      .send(data)
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
  test("409: returns error when slug already exists", () => {
    const data = { slug: "mitch", description: "example description" };
    return request(app)
      .post("/api/topics")
      .send(data)
      .expect(409)
      .then(({ body }) => {
        expect(body.error).toBe("resource already exists");
      });
  });
});

describe("DELETE /api/articles/:article_id", () => {
  test("204: returns statuscode 204 and no content and deletes the specified article", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("404: returns statuscode 404 if trying to delete article that doesn't exist", () => {
    return request(app)
      .delete("/api/articles/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.error).toBe("article not found");
      });
  });
  test("400: returns statuscode 400 if article_id provided is not a number", () => {
    return request(app)
      .delete("/api/articles/notanum")
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("bad request");
      });
  });
});
