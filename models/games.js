const db = require("../db");

const games = {
  async getAll() {
    const sql = `SELECT * FROM games`;
    const res = await db.query(sql);
    return res.rows;
  },
  async getOneById(gameId) {
    const sql = `SELECT * FROM games WHERE id = $1`;
    const res = await db.query(sql, [gameId]);
    return res.rows[0];
  },
  async getAllByUserId(userId) {
    const sql = `SELECT * FROM games INNER JOIN users_games ON games.id = users_games.game_id WHERE users_games.user_id = $1`;
    const res = await db.query(sql, [userId]);
    return res.rows;
  },
  async getAllByUsername(username) {
    const sql = `SELECT * FROM games INNER JOIN users_games ON games.id = users_games.game_id INNER JOIN users ON users.id = users_games.user_id WHERE username = $1`;
    const res = await db.query(sql, [username]);
    return res.rows;
  },
  async checkDuplicate(userId, gameId) {
    const sql = `SELECT * FROM users_games where user_id = $1 AND game_id =$2`;
    const res = await db.query(sql, [userId, gameId]);
    return res.rows.length !== 0;
  },
  async addOneToUser(userId, gameId, hasFinished) {
    const sql = `INSERT INTO users_games (user_id, game_id, finished) VALUES ($1,$2,$3)`;
    await db.query(sql, [userId, gameId, hasFinished]);
  },
  async removeOneFromUser(userId, gameId) {
    const sql = `DELETE FROM users_games WHERE user_id =$1 AND game_id =$2`;
    await db.query(sql, [userId, gameId]);
  },
  async updateOneToUser(hasFinished, userId, gameId) {
    const sql = `UPDATE users_games SET finished = $1 where user_id =$2 AND game_id =$3`;
    await db.query(sql, [hasFinished, userId, gameId]);
  },
};

module.exports = games;
