const models = require("../models");

const request = {
  async create(req, res) {
    await models.request.create(req.params.id, req.session.userId);
    res.redirect(`/user/${req.params.username}`);
  },
  async accept(req, res) {
    const deleteRequest = models.request.delete(req.body.id);
    const addFriend1 = models.friends.add(req.session.userId, req.body.id);
    const addFriend2 = models.friends.add(req.body.id, req.session.userId);
    await Promise.all([deleteRequest, addFriend1, addFriend2]);
    res.redirect("/");
  },
  async reject(req, res) {
    await models.request.delete(req.body.id);
    res.redirect("/");
  },
};

module.exports = request;
