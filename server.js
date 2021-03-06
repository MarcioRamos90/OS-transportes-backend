const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const passport = require("passport");

const allowCors = require("./config/cors");

const users = require("./routes/api/users");
const requesters = require("./routes/api/requesters");
const companies = require("./routes/api/companies");
const drivers = require("./routes/api/drivers");
const cars = require("./routes/api/cars");
const local = require("./routes/api/local");
const passenger = require("./routes/api/passenger");
const services = require("./routes/api/services");
const bills = require("./routes/api/bills");
const logs = require("./routes/api/logs");

const app = express();

// Body parser middleware
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(allowCors);

// DB config
const db = require("./config/keys").mongoURI;

// DB Connection
mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err))

// Passport middleware
app.use(passport.initialize());

// Passport config
require("./config/passport")(passport);

// Use Routes

app.use("/api/services", services)
app.use("/api/bills", bills)
app.use("/api/logs", logs)
app.use("/api/users", users);
app.use("/api/companies", companies);
app.use("/api/requesters", requesters);
app.use("/api/drivers", drivers);
app.use("/api/cars", cars);
app.use("/api/local", local);
app.use("/api/passenger", passenger);
app.use("/api/requesters", requesters);


const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server running on port ${port}`));
