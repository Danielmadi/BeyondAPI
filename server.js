const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const basicAuth = require('./app/_helpers/basic-auth');
const errorHandler = require('./app/_helpers/error-handler');
const compression = require("compression");

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use(compression());
// use basic HTTP auth to secure the api
app.use(basicAuth);
// api routes
app.use('./app/users', require('./app/users/users.controller'));

// global error handler
app.use(errorHandler);
// const db = require("./app/models");
//db.sequelize.sync();
// drop the table if it already exists
//db.sequelize.sync({ alter: true }).then(() => {
  //console.log("Drop and re-sync db.");
//});

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Beyond API" });
});

 require("./app/routes/auth.routes")(app);
 require("./app/routes/general.routes")(app);
 require("./app/routes/subaccount.routes")(app);
 require("./app/routes/tax.routes")(app);
 require("./app/routes/paymentType.routes")(app);
 require("./app/routes/subaccount.routes")(app);
 require("./app/routes/company.routes")(app);
 require("./app/routes/transaction.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
