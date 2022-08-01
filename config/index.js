const sessionConfig = {
  secret: "keyboard cat",
  cookie: { maxAge: 604800000 },
  resave: true,
  saveUninitialized: true,
};

module.exports = { sessionConfig };
  