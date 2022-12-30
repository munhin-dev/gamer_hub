const { body, validationResult } = require("express-validator");

const method = (req, res) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
};

const unless = (middleware) => (req, res, next) => {
  req.path === "/login" || req.path === "/signup"
    ? next()
    : middleware(req, res, next);
};

const hasLogin = (req, res, next) => {
  !req.session.userId ? res.redirect("/login") : next();
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return next();
  const input = req.body;
  res.render("signup", { layout: false, errors: errors.array(), input });
};

const userValidationRules = () => [
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
    "Password must be at least 5 characters long"
  ).isStrongPassword({
    minLength: 5,
  }),
  body("email", "Invalid email address provided").isEmail(),
];

module.exports = {
  method,
  unless,
  hasLogin,
  userValidationRules,
  validate,
};
