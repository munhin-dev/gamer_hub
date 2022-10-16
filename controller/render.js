const models = require("../models");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

const render = {
  async home(req, res) {
    const getGames = models.games.getAllByUserId(req.session.userId);
    const getUser = models.user.getOneById(req.session.userId);
    const getFriends = models.friends.getAllByUserId(req.session.userId);
    const getRequest = models.request.getAllByUserId(req.session.userId);
    const output = await Promise.all([
      getGames,
      getUser,
      getFriends,
      getRequest,
    ]);
    const [games, user, friends, requests] = output;
    res.render("index", { games, user, friends, requests });
  },
  async user(req, res) {
    const userId = req.session.userId;
    const username = req.params.username;
    const getGames = models.games.getAllByUsername(username);
    const getUser = models.user.getOneByUsername(username);
    const getFriends = models.friends.getAllByUsername(username);
    const getHasSent = models.request.checkSent(userId, username);
    const output = await Promise.all([
      getGames,
      getUser,
      getFriends,
      getHasSent,
    ]);
    const [games, user, friends, hasSent] = output;
    const disableRequest = hasSent || user.id === userId;
    res.render("show_user", { user, games, friends, disableRequest });
  },
  async form(req, res) {
    const games = await models.games.getAll();
    res.render("new_game_form", { games });
  },
  async game(req, res) {
    const activeUser = req.session.userId;
    const getGame = models.games.getOneById(req.params.id);
    const getPosts = models.posts.getAllByGameId(req.params.id);
    const getPlayers = models.user.getAllByGameId(req.params.id);
    const output = await Promise.all([getGame, getPosts, getPlayers]);
    const [game, posts, players] = output;
    res.render("show_game", { game, posts, activeUser, players, dayjs });
  },
  login(req, res) {
    res.render("login", { layout: false, error: "" });
  },
  signup(req, res) {
    res.render("signup", { layout: false, errors: [], input: {} });
  },
};

module.exports = render;
