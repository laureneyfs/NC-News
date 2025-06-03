const db = require("./db/connection");

function viewAllUsers() {
  db.query(`SELECT username, name FROM USERS`).then(({ rows }) => {
    console.log("all users below", rows);
  });
}

function viewAllCodingTopicArticles() {
  db.query(`SELECT * FROM articles WHERE topic = 'coding'`).then(({ rows }) => {
    console.log("all articles with topic: coding");
  });
}
function viewAllCommentsWithNegativeVotes() {
  db.query(`SELECT * FROM comments WHERE votes < 0`).then(({ rows }) => {
    console.log(rows);
  });
}
function viewAllTopics() {
  db.query(`SELECT * FROM topics`).then(({ rows }) => {
    console.log(rows);
  });
}
function viewAllArticlesByGrumpy19() {
  db.query(`SELECT * FROM articles WHERE author = 'grumpy19'`).then(
    ({ rows }) => {
      console.log(rows);
    }
  );
}
function getAllCommentsWithMoreThanTenVotes() {
  db.query(`SELECT * FROM comments WHERE votes > 10`).then(({ rows }) => {
    console.log(rows);
  });
}

/*
viewAllUsers()
viewAllCodingTopicArticles()
viewAllCommentsWithNegativeVotes();
viewAllTopics();
viewAllArticlesByGrumpy19();
getAllCommentsWithMoreThanTenVotes();
*/
