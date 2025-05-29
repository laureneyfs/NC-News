const db = require("../../db/connection");

exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};

exports.translateArticleNameToId = (promiseReturn, name) => {
  for (i = 0; i < promiseReturn.length; i++) {
    if (promiseReturn[i].title === name) {
      return promiseReturn[i].article_id;
    }
  }
};
