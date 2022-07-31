const { body, validationResult } = require("express-validator");

const queryOverride = (req, res) => {
  if (req.body && typeof req.body === "object" && "_method" in req.body) {
    const method = req.body._method;
    delete req.body._method;
    return method;
  }
};

const unless = (middleware) => (req, res, next) => {
  if (req.path === "/login" || req.path === "/signup") {
    return next();
  }
  return middleware(req, res, next);
};

const hasLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/login");
  } else {
    next();
  }
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  res.render("signup", { layout: false, errors: errors.array() });
};

const userValidationRules = () => {
  return [
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
  ];
};

module.exports = {
  queryOverride,
  unless,
  hasLogin,
  userValidationRules,
  validate,
};
