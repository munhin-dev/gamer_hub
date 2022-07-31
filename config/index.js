const sessionConfig = {
  secret: "keyboard cat",
  cookie: { maxAge: 60000 },
  resave: true,
  saveUninitialized: true,
};

module.exports = { sessionConfig };
