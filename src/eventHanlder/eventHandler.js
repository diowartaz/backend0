const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const EVENTCODES = {
  MESSAGE: "message",
  TEST: "test",
  // MESSAGE: "message",
};

function onMessageHandler(message, wss, ws) {
  console.log("onMessageHandler");
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      console.log("username", ws.username);
      var wsRes = JSON.stringify({
        message: message,
        username: ws.username,
      });
      client.send(wsRes);
    }
  });
}

function eventHandler(event, wss, ws) {
  try {
    event = JSON.parse(event.toString()); //TODO
    // console.log("event", event);
    // event = { eventCode: EventCode, data: data, JWT: JWT};
    switch (event.eventCode) {
      case EVENTCODES.MESSAGE:
        onMessageHandler(event.data, wss, ws);
        break;
      default:
        ws.send({ error: "eventCode don't match" });
    }
  } catch (e) {
    ws.send({ error: e });
  }
}

// function verifyClientHandler(info, wss) {
//   const { origin, req, secure } = info;

// }
function connectionHandler(JWT, wss, ws) {
  //event = { eventCode: EventCode, data: data, JWT: JWT};
  const decoded = jwt.verify(JWT, process.env.SECRET_KEY_JWT);
  userId = decoded.id;
  User.findOne({ _id: userId })
    .then((user) => {
      ws.username = user.username;
      console.log(ws.username)
    })
    .catch((error) => {
      ws.close();
    });
}

module.exports = { eventHandler, connectionHandler };
