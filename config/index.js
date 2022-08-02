const sessionConfig = {
  secret: "keyboard cat",
  cookie: { maxAge: 1000 * 60 * 60 * 24 },
  resave: false,
  saveUninitialized: true,
};

module.exports = { sessionConfig };
  