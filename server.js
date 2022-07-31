const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const methodOverride = require("method-override");
const { queryOverride, unless, hasLogin } = require("./middleware");
const { sessionConfig } = require("./config");
const app = express();
const router = require("./routes");

app.set("view engine", "ejs");

app.use(express.static("public"));
app.use("/css", express.static("node_modules/bootstrap/dist/css"));
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride(queryOverride));
app.use(session(sessionConfig));
app.use(unless(hasLogin));
app.use(router);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
