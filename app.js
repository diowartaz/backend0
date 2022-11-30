const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");

//Routes
const authRouter = require("./src/routes/user");
const routesRouter = require("./src/routes/routes");

mongoose
  .connect(
    `mongodb+srv://diowartaz:${process.env.DB_PASSWORD}@cluster0.r2zjn.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

// process.env.URL
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/", authRouter);
app.use("/", routesRouter);

module.exports = app;
