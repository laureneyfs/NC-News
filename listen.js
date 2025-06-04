const app = require("./app.js");
const db = require("./db/connection.js");

app.listen(9090, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("listening on port 9090");
  }
});
