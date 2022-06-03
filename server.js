const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const methodOverride = require("method-override");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const app = express();
const { Pool } = require("pg");
const db = new Pool({
  user: "postgres",
  password: "password",
  database: "gamer_hub",
});
const unless = (middleware) => (req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") {
    return next();
  }
  return middleware(req, res, next);
};
const middleware = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/css", express.static("node_modules/bootstrap/dist/css"))
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(
  methodOverride((req, res) => {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

app.use(
  session({
    secret: "keyboard cat",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);

app.use(unless(middleware));

app.get("/", (req, res) => {
  const games = db.query(
    "SELECT * FROM games INNER JOIN users_games ON games.id=users_games.game_id WHERE user_id = $1",
    [req.session.userId]
  );
  const friends = db.query(
    "SELECT * FROM friends INNER JOIN users ON users.id=friends.friend_id WHERE user_id = $1",
    [req.session.userId]
  );
  const friendRequest = db.query(
    "SELECT * FROM friend_request INNER JOIN users ON users.id=friend_request.friend_id WHERE user_id = $1",
    [req.session.userId]
  );
  const users = db.query("SELECT * FROM users WHERE id = $1", [
    req.session.userId,
  ]);

  const finishedGames = db.query(
    "SELECT * FROM users_games WHERE user_id = $1 AND finished=true",
    [req.session.userId]
  );

  const stillPlaying = db.query(
    "SELECT * FROM users_games WHERE user_id = $1 AND finished=false",
    [req.session.userId]
  );

  Promise.all([
    games,
    friends,
    friendRequest,
    users,
    finishedGames,
    stillPlaying,
  ]).then((output) => {
    const [games, friends, friendRequest, users, finishedGames, stillPlaying] =
      output;
    res.render("index", {
      games: games.rows,
      friends: friends.rows,
      requests: friendRequest.rows,
      name: users.rows[0].firstname,
      finishedGames: finishedGames.rows,
      stillPlaying: stillPlaying.rows,
    });
  });
});

app.post("/reqeust/:id/:username", (req, res) => {
  db.query("INSERT INTO friend_request (user_id, friend_id) VALUES ($1, $2)", [
    req.params.id,
    req.session.userId,
  ]).then(() => {
    res.redirect(`/user/${req.params.username}`);
  });
});

app.get("/user/:username", (req, res) => {
  const games = db.query(
    "SELECT * FROM games INNER JOIN users_games ON games.id=users_games.game_id INNER JOIN users ON users.id= users_games.user_id WHERE username = $1",
    [req.params.username]
  );
  const user = db.query("SELECT * FROM users where username = $1", [
    req.params.username,
  ]);
  const friends = user.then((user) =>
    db.query(
      "SELECT * FROM friends INNER JOIN users ON users.id=friends.friend_id WHERE username != $1 AND friends.user_id = $2",
      [req.params.username, user.rows[0].id]
    )
  );
  const pendingRequest = user.then((user) =>
    db.query(
      "SELECT * from friend_request where user_id = $1 and friend_id =$2",
      [req.session.userId, user.rows[0].id]
    )
  );

  const alreadyRequest = user.then((user) =>
    db.query(
      "SELECT * from friend_request where user_id = $2 and friend_id =$1",
      [req.session.userId, user.rows[0].id]
    )
  );

  const alreadyFriend = user.then((user) =>
    db.query("SELECT * from friends where user_id = $2 and friend_id =$1", [
      req.session.userId,
      user.rows[0].id,
    ])
  );
  const finishedGames = user.then((user) =>
    db.query("SELECT * FROM users_games WHERE user_id = $1 AND finished=true", [
      user.rows[0].id,
    ])
  );
  const stillPlaying = user.then((user) =>
    db.query(
      "SELECT * FROM users_games WHERE user_id = $1 AND finished=false",
      [user.rows[0].id]
    )
  );

  Promise.all([
    games,
    user,
    friends,
    alreadyFriend,
    pendingRequest,
    finishedGames,
    stillPlaying,
    alreadyRequest,
  ]).then((output) => {
    const [
      games,
      user,
      friends,
      alreadyFriend,
      pendingRequest,
      finishedGames,
      stillPlaying,
      alreadyRequest,
    ] = output;

    const disableRequest =
      alreadyFriend.rows.length > 0 ||
      alreadyRequest.rows.length > 0 ||
      pendingRequest.rows.length > 0 ||
      user.rows[0].id === req.session.userId;
    res.render("show_user", {
      user: user.rows[0],
      games: games.rows,
      friends: friends.rows,
      finishedGames: finishedGames.rows,
      stillPlaying: stillPlaying.rows,
      disableRequest,
    });
  });
});

app.get("/games/new", (req, res) => {
  db.query("SELECT * FROM games").then((results) => {
    res.render("new_game_form", { games: results.rows });
  });
});

app.get("/games/:id", (req, res) => {
  const games = db.query("SELECT * FROM games WHERE id = $1", [req.params.id]);
  const posts = db.query(
    "SELECT * FROM users INNER JOIN posts ON posts.user_id = users.id WHERE game_id = $1",
    [req.params.id]
  );
  const users = db.query(
    "SELECT username FROM users_games INNER JOIN games ON games.id=users_games.game_id INNER JOIN users ON users.id = users_games.user_id WHERE games.id=$1",
    [req.params.id]
  );

  Promise.all([games, posts, users]).then((output) => {
    const [games, posts, users] = output;
    res.render("show_game", {
      game: games.rows[0],
      posts: posts.rows,
      activeUser: req.session.userId,
      players: users.rows,
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login", { layout: false, error: "" });
});

app.post("/games", (req, res) => {
  db.query("SELECT * FROM users_games where user_id = $1 AND game_id =$2", [
    req.session.userId,
    req.body.games,
  ]).then((results) => {
    if (results.rows.length !== 0) {
      res.redirect("/");
      return;
    }
    db.query(
      "INSERT INTO users_games (user_id, game_id, finished) VALUES ($1,$2,$3)",
      [req.session.userId, req.body.games, req.body.finished]
    ).then(() => {
      res.redirect("/");
    });
  });
});

app.delete("/games/:userId/:gameId", (req, res) => {
  db.query("delete from users_games where user_id =$1 AND game_id =$2", [
    req.params.userId,
    req.params.gameId,
  ]).then(() => {
    res.redirect("/");
  });
});

app.post("/login", (req, res) => {
  db.query("SELECT * FROM users WHERE username=$1", [req.body.username]).then(
    (users) => {
      if (users.rows.length === 0) {
        res.render("login", {
          error: "Invalid username or password",
          layout: false,
        });
        return;
      }
      bcrypt
        .compare(req.body.password, users.rows[0].password_digest)
        .then((result) => {
          if (result) {
            req.session.userId = users.rows[0].id;
            res.redirect("/");
          } else {
            res.render("login", {
              error: "Invalid username or password",
              layout: false,
            });
          }
        });
    }
  );
});

app.put("/games/:id", (req, res) => {
  db.query(
    "UPDATE users_games SET finished=$1 where user_id =$2 AND game_id =$3",
    [req.body.finished, req.session.userId, req.params.id]
  ).then(() => {
    res.redirect("/");
  });
});

app.post("/posts/:id", (req, res) => {
  db.query(
    "INSERT INTO posts (content, user_id, game_id, created_at) VALUES($1, $2, $3, current_timestamp)",
    [req.body.content, req.session.userId, req.params.id]
  ).then(() => {
    res.redirect(`/games/${req.params.id}`);
  });
});

app.delete("/posts/:id/:gameID", (req, res) => {
  db.query("DELETE FROM posts WHERE id = $1", [req.params.id]).then(() => {
    res.redirect(`/games/${req.params.gameID}`);
  });
});

app.post("/accept", (req, res) =>
  db
    .query("DELETE FROM friend_request WHERE friend_id = $1", [req.body.id])
    .then(() =>
      db.query("INSERT INTO friends (user_id, friend_id) VALUES ($1, $2)", [
        req.session.userId,
        req.body.id,
      ])
    )
    .then(() =>
      db.query("INSERT INTO friends (user_id, friend_id) VALUES ($2, $1)", [
        req.session.userId,
        req.body.id,
      ])
    )
    .then(() => {
      res.redirect("/");
    })
);

app.post("/reject", (req, res) => {
  db.query("DELETE FROM friend_request WHERE friend_id = $1", [
    req.body.id,
  ]).then(() => {
    res.redirect("/");
  });
});

app.delete("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

app.get("/signup", (req, res) => {
  res.render("signup", { layout: false, errors: [] });
});

app.post(
  "/signup",
  body("fname", "No special characters allowed for first name")
    .trim()
    .isAlpha(undefined, {
      ignore: " ",
    })
    .isLength({ max: 64 }),
  body("lname", "No special characters allowed for last name")
    .trim()
    .isAlpha(undefined, {
      ignore: " ",
    })
    .isLength({ max: 64 }),
  body("username", "Only alphanumeric characters allowed for username")
    .trim()
    .isAlphanumeric(undefined, {
      ignore: "_-",
    })
    .isLength({ max: 32 }),
  body(
    "password",
    "Password must be at least 5 characters long and contain one uppercase letters and one special case letter"
  ).isStrongPassword({
    minLength: 5,
    minLowercase: 0,
    minUppercase: 1,
    minNumbers: 0,
    minSymbols: 1,
  }),
  body("email", "Invalid email address provided").isEmail(),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("signup", { layout: false, errors: errors.array() });
      return;
    }

    db.query("SELECT * FROM users WHERE email_address=$1 OR username=$2", [
      req.body.email,
      req.body.username,
    ]).then((alreadyExists) => {
      if (alreadyExists.rows.length > 0) {
        res.render("signup", {
          layout: false,
          errors: [{ msg: "Account already exists!!" }],
        });
      } else {
        bcrypt.genSalt(10).then((salt) =>
          bcrypt.hash(req.body.password, salt).then((hash) => {
            db.query(
              "INSERT INTO users (firstname,lastname,username, password_digest, email_address) VALUES ($1, $2, $3, $4, $5)",
              [
                req.body.fname,
                req.body.lname,
                req.body.username,
                hash,
                req.body.email,
              ]
            ).then(() => res.render("redirect", { layout: false }));
          })
        );
      }
    });
  }
);

app.delete("/user/:id", (req, res) => {
  db.query("DELETE FROM friends WHERE user_id=$1 AND friend_id=$2", [
    req.session.userId,
    req.params.id,
  ]).then(() =>
    db
      .query("DELETE FROM friends WHERE user_id=$2 AND friend_id=$1", [
        req.session.userId,
        req.params.id,
      ])
      .then(() => res.redirect("/"))
  );
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
