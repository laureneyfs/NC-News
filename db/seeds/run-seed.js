const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
  return seed(devData)
    .then(() => {
      console.log("seeded successfully");
      db.end();
    })
    .catch((err) => {
      console.error("seeding failed:", err);
      return db.end();
    });
};

runSeed();
