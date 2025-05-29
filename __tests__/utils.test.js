const {
  convertTimestampToDate,
  translateArticleNameToId,
} = require("../db/seeds/utils");

describe("convertTimestampToDate", () => {
  test("returns a new object", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result).not.toBe(input);
    expect(result).toBeObject();
  });
  test("converts a created_at property to a date", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    const result = convertTimestampToDate(input);
    expect(result.created_at).toBeDate();
    expect(result.created_at).toEqual(new Date(timestamp));
  });
  test("does not mutate the input", () => {
    const timestamp = 1557572706232;
    const input = { created_at: timestamp };
    convertTimestampToDate(input);
    const control = { created_at: timestamp };
    expect(input).toEqual(control);
  });
  test("ignores includes any other key-value-pairs in returned object", () => {
    const input = { created_at: 0, key1: true, key2: 1 };
    const result = convertTimestampToDate(input);
    expect(result.key1).toBe(true);
    expect(result.key2).toBe(1);
  });
  test("returns unchanged object if no created_at property", () => {
    const input = { key: "value" };
    const result = convertTimestampToDate(input);
    const expected = { key: "value" };
    expect(result).toEqual(expected);
  });
});

describe("translateArticleNameToId", () => {
  test("returns the correct id when passed array with one entry", () => {
    const input = [{ article_id: 1, title: "this one" }];
    const result = translateArticleNameToId(input, "this one");
    const expected = 1;
    expect(result).toBe(expected);
  });

  test("returns the correct id when passed array with multiple entries with no irrelevant fields", () => {
    const input = [
      { article_id: 2, title: "not this one" },
      { article_id: 1, title: "this one" },
    ];
    const result = translateArticleNameToId(input, "this one");
    const expected = 1;
    expect(result).toBe(expected);
  });
  test("returns the correct id when passed array with multiple items that contain irrelevant fields", () => {
    const input = [
      {
        article_id: 10,
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 11,
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 12,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
      {
        article_id: 13,
        title: "Another article about Mitch",
        topic: "mitch",
        author: "butter_bridge",
        body: "There will never be enough articles about Mitch!",
        votes: 0,
        article_img_url:
          "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
      },
    ];
    const result = translateArticleNameToId(
      input,
      "Seven inspirational thought leaders from Manchester UK"
    );
    const expected = 10;
    expect(result).toBe(expected);
  });
});
