const db = require("../db");

const posts = {
  async getAllByGameId(gameId) {
    const sql = `SELECT * FROM users INNER JOIN posts ON posts.user_id = users.id WHERE game_id = $1 ORDER BY created_at DESC`;
    const res = await db.query(sql, [gameId]);
    return res.rows;
  },
  async create(content, userId, gameId) {
    const sql = `INSERT INTO posts (content, user_id, game_id, created_at) VALUES($1, $2, $3, current_timestamp)`;
    await db.query(sql, [content, userId, gameId]);
  },
  async delete(id) {
    const sql = `DELETE FROM posts WHERE id = $1`;
    await db.query(sql, [id]);
  },
};

module.exports = posts;
