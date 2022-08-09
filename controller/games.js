const models = require("../models");

const games = {
  async add(req, res) {
    const { userId } = req.session;
    const { games, finished } = req.body;
    const hasDuplicate = await models.games.checkDuplicate(userId, games);
    if (hasDuplicate) return res.redirect("/");
    await models.games.addOneToUser(userId, games, finished);
    res.redirect("/");
  },
  async remove(req, res) {
    await models.games.removeOneFromUser(req.params.userId, req.params.gameId);
    res.redirect("/");
  },
  async update(req, res) {
    const { finished } = req.body;
    const { userId } = req.session;
    const { id } = req.params;
    await models.games.updateOneToUser(finished, userId, id);
    res.redirect("/");
  },
};

module.exports = games;
