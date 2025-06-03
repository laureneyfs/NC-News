const db = require("../connection");
const format = require("pg-format");
const { translateArticleNameToId } = require("./utils");

const seed = ({
  topicData,
  userData,
  articleData,
  commentData,
  emojisData,
  emojiArticleUserData,
  userTopicData,
  userArticleVotesData,
}) => {
  return db
    .query(`DROP TABLE IF EXISTS emoji_article_user;`)
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_topic;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS user_article_votes;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS emojis;`);
    })
    .then(() => {
      return db.query(`DROP TABLE IF EXISTS comments`);
    })
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
          return db.query(
            `CREATE TABLE emojis(emoji_id SERIAL PRIMARY KEY, emoji VARCHAR(1) NOT NULL, emoji_name VARCHAR(20));`
          );
        })
        .then(() => {
          return db.query(
            `CREATE TABLE emoji_article_user(
              emoji_article_user_id SERIAL PRIMARY KEY, 
              emoji_id INT, 
              FOREIGN KEY (emoji_id) REFERENCES emojis(emoji_id), 
              username VARCHAR(16), 
              FOREIGN KEY (username) REFERENCES users(username), 
              article_id INT, 
              FOREIGN KEY (article_id) REFERENCES articles(article_id),
              UNIQUE (emoji_id, username, article_id)
            );`
          );
        })
        .then(() => {
          return db.query(
            `CREATE TABLE user_topic(
              user_topic_id SERIAL PRIMARY KEY, 
              username VARCHAR(16), 
              FOREIGN KEY (username) REFERENCES users(username), 
              topic VARCHAR(50), 
              FOREIGN KEY (topic) REFERENCES topics(slug),
              UNIQUE (username, topic)
            );`
          );
        })
        .then(() => {
          return db.query(
            `CREATE TABLE user_article_votes(
              user_article_votes_id SERIAL PRIMARY KEY, 
              username VARCHAR(16), 
              FOREIGN KEY (username) REFERENCES users(username), 
              article_id INT, 
              FOREIGN KEY (article_id) REFERENCES articles(article_id), 
              vote_count INT NOT NULL,
              UNIQUE (username, article_id)
            );`
          );
        })
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
      return db.query(sqlCommentString).then(() => rows);
    })
    .then((articles) => {
      const formattedEmojiValues = emojisData.map(({ emoji, emoji_name }) => {
        return [emoji, emoji_name];
      });
      const sqlEmojisString = format(
        `INSERT INTO emojis(emoji, emoji_name) VALUES %L RETURNING *;`,
        formattedEmojiValues
      );
      return db
        .query(sqlEmojisString)
        .then(({ rows }) => ({ articles, emojis: rows }));
    })
    .then(({ articles }) => {
      const formattedEmojiArticleUserValues = emojiArticleUserData.map(
        ({ emoji_id, username, article_id }) => {
          return [emoji_id, username, article_id];
        }
      );
      const sql = format(
        `INSERT INTO emoji_article_user(emoji_id, username, article_id) VALUES %L;`,
        formattedEmojiArticleUserValues
      );
      return db.query(sql).then(() => articles);
    })
    .then((articles) => {
      const formattedUserTopicValues = userTopicData.map(
        ({ username, topic }) => {
          return [username, topic];
        }
      );
      const sql = format(
        `INSERT INTO user_topic(username, topic) VALUES %L;`,
        formattedUserTopicValues
      );
      return db.query(sql).then(() => articles);
    })
    .then((articles) => {
      const formattedUserArticleVoteValues = userArticleVotesData.map(
        ({ username, article_title, vote_count }) => {
          return [
            username,
            translateArticleNameToId(articles, article_title),
            vote_count,
          ];
        }
      );
      const sql = format(
        `INSERT INTO user_article_votes(username, article_id, vote_count) VALUES %L;`,
        formattedUserArticleVoteValues
      );
      return db.query(sql);
    });
};

module.exports = seed;
