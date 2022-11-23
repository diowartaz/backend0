const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require('cors')

//Routes
const authRouter = require("./src/routes/user");
const routesRouter = require("./src/routes/routes");

//middleWares
require("./src/middlewares/auth");

mongoose
  .connect(
    `mongodb+srv://diowartaz:${process.env.DB_PASSWORD}@cluster0.r2zjn.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

app.use(cors());
app.use(express.json());

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PUT, DELETE, PATCH, OPTIONS"
//   );
//   next();
// });

app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", routesRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });

  return;
});

module.exports = app;
