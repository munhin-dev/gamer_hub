const models = require("../models");

const friends = {
  async remove(req, res) {
    const removeFriend1 = models.friends.remove(
      req.session.userId,
      req.params.id
    );
    const removeFriend2 = models.friends.remove(
      req.params.id,
      req.session.userId
    );
    await Promise.all([removeFriend1, removeFriend2]);
    res.redirect("/");
  },
};

module.exports = friends;
