const models = require("../models");

const friends = {
  async remove(req, res) {
    await models.friends.remove(req.session.userId, req.params.id);
    res.redirect("/");
  },
};

module.exports = friends;
