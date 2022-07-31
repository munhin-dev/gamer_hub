const { Pool } = require("pg");
const db = new Pool({
  user: "postgres",
  password: "password",
  database: "gamer_hub",
});

module.exports = db;
