const sessionConfig = {
  secret: "keyboard cat",
  cookie: { maxAge: null },
  resave: true,
  saveUninitialized: true,
};

module.exports = { sessionConfig };
