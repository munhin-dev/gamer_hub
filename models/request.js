const db = require("../db");

const request = {
  async getAllByUserId(userId) {
    const sql = `SELECT username,friend_id FROM friend_request INNER JOIN users ON users.id=friend_request.friend_id WHERE user_id = $1`;
    const res = await db.query(sql, [userId]);
    return res.rows;
  },
  async checkSent(userId, targetUserName) {
    const sql = `SELECT username from friends INNER JOIN users as friends_info ON friends.friend_id = friends_info.id WHERE user_id = $1 AND username = $2 UNION SELECT username from friend_request INNER JOIN users as friend_request_info ON friend_request.friend_id = friend_request_info.id WHERE user_id = $1 AND username = $2 UNION SELECT username from friend_request INNER JOIN users as friend_request_info ON friend_request.user_id = friend_request_info.id WHERE friend_id = $1 AND username = $2`;
    const res = await db.query(sql, [userId, targetUserName]);
    return res.rows.length > 0;
  },
  async create(userId, friendId) {
    const sql = `INSERT INTO friend_request (user_id, friend_id) VALUES ($1, $2)`;
    await db.query(sql, [userId, friendId]);
  },
  async delete(friendId) {
    const sql = `DELETE FROM friend_request WHERE friend_id = $1`;
    await db.query(sql, [friendId]);
  },
};

module.exports = request;
