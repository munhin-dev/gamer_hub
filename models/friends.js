const db = require("../db");

const friends = {
  async getAllByUserId(userId) {
    const sql = `SELECT username, friend_id FROM friends INNER JOIN users ON users.id = friends.friend_id WHERE user_id = $1`;
    const res = await db.query(sql, [userId]);
    return res.rows;
  },
  async getAllByUsername(username) {
    const sql = `SELECT friends_info.id, friends_info.username FROM friends INNER JOIN users AS friends_info ON friends_info.id = friends.friend_id INNER JOIN users AS user_info ON user_info.id = friends.user_id WHERE user_info.username = $1`;
    const res = await db.query(sql, [username]);
    return res.rows;
  },
  add(userId, friendId) {
    const sql = `INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)`;
    return Promise.all(sql, [
      db.query(sql, [userId, friendId]),
      db.query(sql, [friendId, userId]),
    ]);
  },
  remove(userId, friendId) {
    const sql = `DELETE FROM friends WHERE user_id=$1 AND friend_id=$2`;
    return Promise.all([
      db.query(sql, [userId, friendId]),
      db.query(sql, [friendId, userId]),
    ]);
  },
};

module.exports = friends;
