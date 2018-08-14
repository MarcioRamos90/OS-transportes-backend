const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

const users = require("./routes/api/users");
const requesters = require("./routes/api/requesters");
const companies = require("./routes/api/companies");
const drivers = require("./routes/api/drivers");
const cars = require("./routes/api/cars");
const allowCors = require("./config/cors");

const app = express();

// Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(allowCors);

// DB config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// USe Routes
app.use("/api/users", users);
app.use("/api/requesters", requesters);
app.use("/api/companies", companies);
app.use("/api/drivers", drivers);
app.use("/api/cars", cars);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
