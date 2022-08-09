const express = require("express");
const app = express.Router();
const controller = require("../controller");
const { userValidationRules, validate } = require("../middleware");

app.get("/", controller.render.home);
app.get("/user/:username", controller.render.user);
app.get("/games/new", controller.render.form);
app.get("/games/:id", controller.render.game);
app.get("/login", controller.render.login);
app.get("/signup", controller.render.signup);

app.post("/games", controller.games.add);
app.put("/games/:id", controller.games.update);
app.delete("/games/:userId/:gameId", controller.games.remove);

app.post("/posts/:id", controller.posts.add);
app.delete("/posts/:id/:gameID", controller.posts.remove);

app.post("/request/:id/:username", controller.reqeust.create);
app.post("/accept", controller.reqeust.accept);
app.post("/reject", controller.reqeust.reject);

app.delete("/user/:id", controller.friends.remove);

app.post("/login", controller.user.login);
app.post("/signup", userValidationRules(), validate, controller.user.signup);
app.delete("/logout", controller.user.logout);

module.exports = app;
