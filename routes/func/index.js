const Games = require("../../models/Games");
const User = require("../../models/User");
const Posts = require("../../models/Posts");
const Friends = require("../../models/Friends");
const FriendRequest = require("../../models/FriendRequest");
const bcrypt = require("bcrypt");
const dayjs = require("dayjs");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

//Render Page
async function renderHome(req, res) {
  const getGames = Games.getAllByUserId(req.session.userId);
  const getUser = User.getOneById(req.session.userId);
  const getFriends = Friends.getAllByUserId(req.session.userId);
  const getRequest = FriendRequest.getAllByUserId(req.session.userId);
  const output = await Promise.all([getGames, getUser, getFriends, getRequest]);
  const [games, user, friends, requests] = output;
  res.render("index", { games, user, friends, requests });
}

async function renderUser(req, res) {
  const userId = req.session.userId;
  const username = req.params.username;
  const getGames = Games.getAllByUsername(username);
  const getUser = User.getOneByUsername(username);
  const getFriends = Friends.getAllByUsername(username);
  const getHasSent = FriendRequest.checkSent(userId, username);
  const output = await Promise.all([getGames, getUser, getFriends, getHasSent]);
  const [games, user, friends, hasSent] = output;
  const disableRequest = hasSent || user.id === userId;
  res.render("show_user", { user, games, friends, disableRequest });
}

async function renderForm(req, res) {
  const games = await Games.getAll();
  res.render("new_game_form", { games });
}

async function renderGame(req, res) {
  const activeUser = req.session.userId;
  const getGame = Games.getOneById(req.params.id);
  const getPosts = Posts.getAllByGameId(req.params.id);
  const getPlayers = User.getAllByGameId(req.params.id);
  const output = await Promise.all([getGame, getPosts, getPlayers]);
  const [game, posts, players] = output;
  res.render("show_game", { game, posts, activeUser, players, dayjs });
}

function renderLogin(req, res) {
  res.render("login", { layout: false, error: "" });
}

function renderSignup(req, res) {
  res.render("signup", { layout: false, errors: [] });
}

//Handle Friend Request
async function createRequest(req, res) {
  await FriendRequest.create(req.params.id, req.session.userId);
  res.redirect(`/user/${req.params.username}`);
}

async function acceptRequest(req, res) {
  await FriendRequest.delete(req.body.id);
  await Friends.add(req.session.userId, req.body.id);
  await Friends.add(req.body.id, req.session.userId);
  res.redirect("/");
}

async function rejectRequest(req, res) {
  await FriendRequest.delete(req.body.id);
  res.redirect("/");
}

//Handle Friends
async function removeFriend(req, res) {
  await Friends.remove(req.session.userId, req.params.id);
  await Friends.remove(req.params.id, req.session.userId);
  res.redirect("/");
}

//Handle Games
async function addGame(req, res) {
  const { userId } = req.session;
  const { games, finished } = req.body;
  const hasDuplicate = await Games.checkDuplicate(userId, games);
  if (hasDuplicate) return res.redirect("/");
  await Games.addOneToUser(userId, games, finished);
  res.redirect("/");
}

async function removeGame(req, res) {
  await Games.removeOneFromUser(req.params.userId, req.params.gameId);
  res.redirect("/");
}

async function updateGame(req, res) {
  const { finished } = req.body;
  const { userId } = req.session;
  const { id } = req.params;
  await Games.updateOneToUser(finished, userId, id);
  res.redirect("/");
}

//Handle Posts
async function addPosts(req, res) {
  await Posts.create(req.body.content, req.session.userId, req.params.id);
  res.redirect(`/games/${req.params.id}`);
}

async function removePosts(req, res) {
  Posts.delete(req.params.id);
  res.redirect(`/games/${req.params.gameID}`);
}

//Handle Login
async function handleLogin(req, res) {
  const user = await User.getOneByUsername(req.body.username);
  if (!user) {
    res.render("login", {
      error: "Invalid username or password",
      layout: false,
    });
    return;
  }
  const result = await bcrypt.compare(req.body.password, user.password_digest);
  if (result) {
    req.session.userId = user.id;
    res.redirect("/");
  } else {
    res.render("login", {
      error: "Invalid username or password",
      layout: false,
    });
  }
}

//Handle Signup
async function handleSignup(req, res) {
  const { email, username, fname, lname, password } = req.body;
  const user = await User.getByUsernameOrEmail(email, username);
  if (user.length > 0) {
    res.render("signup", {
      layout: false,
      errors: [{ msg: "Account already exists!!" }],
    });
    return;
  }
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  await User.create(fname, lname, username, hash, email);
  res.render("redirect", { layout: false });
}

//Handle Logout
async function handleLogout(req, res) {
  req.session.destroy();
  res.redirect("/login");
}

module.exports = {
  renderHome,
  renderUser,
  renderGame,
  renderLogin,
  renderSignup,
  addGame,
  removeGame,
  updateGame,
  addPosts,
  removePosts,
  handleLogin,
  handleSignup,
  handleLogout,
  renderForm,
  createRequest,
  acceptRequest,
  rejectRequest,
  removeFriend,
};
