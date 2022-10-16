const models = require("../models");

const posts = {
  async add(req, res) {
    await models.posts.create(
      req.body.content,
      req.session.userId,
      req.params.id
    );
    res.redirect(`/games/${req.params.id}`);
  },

  async remove(req, res) {
    await models.posts.delete(req.params.id);
    res.redirect(`/games/${req.params.gameID}`);
  },
};

module.exports = posts;
