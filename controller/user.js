const models = require("../models");
const bcrypt = require("bcrypt");

const user = {
  async signup(req, res) {
    const { email, username, fname, lname, password } = req.body;
    const errors = [{ msg: "Account exists with same email or username" }];
    const config = { layout: false, errors, input: req.body };
    const user = await models.user.getByUsernameOrEmail(email, username);
    if (user.length > 0) return res.render("signup", config);
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await models.user.create(fname, lname, username, hash, email);
    res.render("redirect", { layout: false });
  },
  async logout(req, res) {
    req.session.destroy();
    res.redirect("/login");
  },
  async login(req, res) {
    const err = { error: "Invalid username or password", layout: false };
    const user = await models.user.getOneByUsername(req.body.username);
    if (!user) return res.render("login", err);
    const result = await bcrypt.compare(
      req.body.password,
      user.password_digest
    );
    if (!result) return res.render("login", err);
    req.session.userId = user.id;
    res.redirect("/");
  },
};

module.exports = user;
