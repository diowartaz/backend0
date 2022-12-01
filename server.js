const http = require("http");
const app = require("./app");
const {
  eventHandler,
  connectionHandler,
} = require("./src/eventHanlder/eventHandler");
const WebSocket = require("ws");
// const egfgreg = require("./src/utils/swagger");

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// const https = require("https");
// const path = require("path");
// const fs = require("fs");
// const httpsOptions = {
//   cert: fs.readFileSync(path.join(__dirname, "ssl", "server.crt")),
//   key: fs.readFileSync(path.join(__dirname, "ssl", "server.key")),
// };
// const server = https.createServer(httpsOptions, app);

const server = http.createServer(app);

///////////////////////////////////// Debut ws ///////////////////////////////////////////
const wss = new WebSocket.Server({ server }); // path: "/chat"

wss.on("connection", function connection(ws, request, client) {
  try {
    const JWT = request.url.slice(1);
    connectionHandler(JWT, wss, ws);
  } catch (e) {
    console.log("error: close ws", e);
    ws.close(3401, "Authentification error"); //3401, "Authentification error"
  }

  ws.on("message", function message(data) {
    try {
      eventHandler(data, wss, ws);
    } catch (e) {
      console.log(e);
    }
  });
});

wss.on("error", function revve() {
  console.log("wss.on error");
});

///////////////////////////////////// Fin ws ///////////////////////////////////////////

server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

server.listen(port);
