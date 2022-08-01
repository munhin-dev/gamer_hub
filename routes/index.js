const express = require("express");
const app = express.Router();
const routes = require("./func");
const { userValidationRules, validate } = require("../middleware");

app.get("/", routes.renderHome);
app.get("/user/:username", routes.renderUser);
app.get("/games/new", routes.renderForm);
app.get("/games/:id", routes.renderGame);

app.post("/games", routes.addGame);
app.put("/games/:id", routes.updateGame);
app.delete("/games/:userId/:gameId", routes.removeGame);

app.post("/posts/:id", routes.addPosts);
app.delete("/posts/:id/:gameID", routes.removePosts);

app.post("/request/:id/:username", routes.createRequest);
app.post("/accept", routes.acceptRequest);
app.post("/reject", routes.rejectRequest);

app.delete("/user/:id", routes.removeFriend);

app.get("/login", routes.renderLogin);
app.post("/login", routes.handleLogin);

app.get("/signup", routes.renderSignup);
app.post("/signup", userValidationRules(), validate, routes.handleSignup);

app.delete("/logout", routes.handleLogout);

module.exports = app;
