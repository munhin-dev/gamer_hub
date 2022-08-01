const express = require("express");
const app = express.Router();
const controller = require("../controller");
const { userValidationRules, validate } = require("../middleware");

app.get("/", controller.renderHome);
app.get("/user/:username", controller.renderUser);
app.get("/games/new", controller.renderForm);
app.get("/games/:id", controller.renderGame);

app.post("/games", controller.addGame);
app.put("/games/:id", controller.updateGame);
app.delete("/games/:userId/:gameId", controller.removeGame);

app.post("/posts/:id", controller.addPosts);
app.delete("/posts/:id/:gameID", controller.removePosts);

app.post("/request/:id/:username", controller.createRequest);
app.post("/accept", controller.acceptRequest);
app.post("/reject", controller.rejectRequest);

app.delete("/user/:id", controller.removeFriend);

app.get("/login", controller.renderLogin);
app.post("/login", controller.handleLogin);

app.get("/signup", controller.renderSignup);
app.post("/signup", userValidationRules(), validate, controller.handleSignup);

app.delete("/logout", controller.handleLogout);

module.exports = app;
