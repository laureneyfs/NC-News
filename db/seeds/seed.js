const db = require("../connection");
const format = require("pg-format");
const { translateArticleNameToId } = require("./utils");

const seed = ({ topicData, userData, articleData, commentData }) => {
  return db
    .query(`DROP TABLE IF EXISTS comments`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS articles`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS users`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS topics`);
    })
    .then(() => {
      return db.query(
        `CREATE TABLE topics(slug VARCHAR(30) PRIMARY KEY, description VARCHAR(60) NOT NULL, img_url VARCHAR(1000));`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE users(username VARCHAR(16) PRIMARY KEY, name VARCHAR(16) NOT NULL, avatar_url VARCHAR(1000));`
      );
    })
    .then(() => {
      return db.query(
        `CREATE TABLE articles(article_id SERIAL PRIMARY KEY, title VARCHAR(100) NOT NULL, topic VARCHAR(50), FOREIGN KEY (topic) REFERENCES topics(slug), author VARCHAR(20), FOREIGN KEY (author) REFERENCES users(username), body TEXT, created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, votes INT DEFAULT 0, article_img_url VARCHAR(1000));`
      );
    })
    .then(() => {
      return db
        .query(
          `CREATE TABLE comments(comment_id SERIAL PRIMARY KEY, article_id INT, FOREIGN KEY(article_id) REFERENCES articles(article_id), body TEXT, votes INT DEFAULT 0, author VARCHAR(20), FOREIGN KEY (author) REFERENCES users(username), created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP);`
        )
        .then(() => {
          const formattedTopicValues = topicData.map(
            ({ description, slug, img_url }) => {
              return [description, slug, img_url];
            }
          );
          const sqlTopicsString = format(
            `INSERT INTO topics(description, slug, img_url) VALUES %L;`,
            formattedTopicValues
          );
          return db.query(sqlTopicsString);
        });
    })
    .then(() => {
      const formattedUserValues = userData.map(
        ({ username, name, avatar_url }) => {
          return [username, name, avatar_url];
        }
      );
      const sqlUserString = format(
        `INSERT INTO users(username, name, avatar_url) VALUES %L;`,
        formattedUserValues
      );
      return db.query(sqlUserString);
    })
    .then(() => {
      const formattedArticleValues = articleData.map(
        ({
          title,
          topic,
          author,
          body,
          created_at,
          votes,
          article_img_url,
        }) => {
          return [
            title,
            topic,
            author,
            body,
            new Date(created_at),
            votes,
            article_img_url,
          ];
        }
      );
      const sqlArticleString = format(
        `INSERT INTO articles(title, topic, author, body, created_at, votes, article_img_url) VALUES %L RETURNING *;`,
        formattedArticleValues
      );
      return db.query(sqlArticleString);
    })
    .then(({ rows }) => {
      const formattedCommentValues = commentData.map(
        ({ article_title, body, votes, author, created_at }) => {
          return [
            translateArticleNameToId(rows, article_title),
            body,
            votes,
            author,
            new Date(created_at),
          ];
        }
      );
      const sqlCommentString = format(
        `INSERT INTO comments(article_id, body, votes, author, created_at) VALUES %L;`,
        formattedCommentValues
      );
      return db.query(sqlCommentString);
    });
};
module.exports = seed;
