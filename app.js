const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
var cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const { optionsSwagger } = require("./src/utils/swagger");
const { logger } = require("./src/middlewares/logger");

//Routes
const authRouter = require("./src/routes/user");
const routesRouter = require("./src/routes/routes");
const cityRouter = require("./src/routes/city");
const playerRouter = require("./src/routes/player");

mongoose
  .connect(
    `mongodb+srv://diowartaz:${process.env.DB_PASSWORD}@cluster0.r2zjn.mongodb.net/?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch((err) => console.log("Connexion à MongoDB échouée !", err));

app.use(cors()); // process.env.URL
app.use(express.json());
app.use(bodyParser.json());
app.use(logger);

app.use("/", authRouter);
app.use("/", routesRouter);
app.use("/city", cityRouter);
app.use("/player", playerRouter);

const specs = swaggerJsdoc(optionsSwagger);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

module.exports = app;
