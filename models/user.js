const db = require("../db");

const user = {
  async getOneById(userId) {
    const sql = `SELECT * FROM users WHERE id = $1`;
    const res = await db.query(sql, [userId]);
    return res.rows[0];
  },
  async getOneByUsername(username) {
    const sql = `SELECT * FROM users where username = $1`;
    const res = await db.query(sql, [username]);
    return res.rows[0];
  },
  async getByUsernameOrEmail(username, email) {
    const sql = `SELECT * FROM users WHERE email_address=$1 OR username=$2`;
    const res = await db.query(sql, [username, email]);
    return res.rows;
  },
  async getAllByGameId(gameId) {
    const sql = `SELECT username FROM users_games INNER JOIN games ON games.id=users_games.game_id INNER JOIN users ON users.id = users_games.user_id WHERE games.id = $1`;
    const res = await db.query(sql, [gameId]);
    return res.rows;
  },
  async create(fname, lname, username, hash, email) {
    const sql = `INSERT INTO users (firstname,lastname,username, password_digest, email_address) VALUES ($1, $2, $3, $4, $5)`;
    await db.query(sql, [fname, lname, username, hash, email]);
  },
};

module.exports = user;
