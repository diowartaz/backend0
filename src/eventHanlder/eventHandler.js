const WebSocket = require("ws");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const EVENTCODES = {
  MESSAGE: "message",
  TYPING: "typing",
};

function onMessageHandler(message, wss, ws) {
  console.log("onMessageHandler");
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      var wsRes = JSON.stringify({
        eventCode: "message",
        message: message,
        username: ws.username,
        timestamp: new Date().getTime(),
      });
      client.send(wsRes);
    }
  });
}

function onTypingHandler(wss, ws) {
  ws.isTyping = ws.isTyping ? !ws.isTyping : true;
  wss.clients.forEach(function each(client) {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      var wsRes = JSON.stringify({
        eventCode: "typing",
        username: ws.username,
        isTyping: ws.isTyping,
      });
      client.send(wsRes);
    }
  });
}

function eventHandler(event, wss, ws) {
  try {
    event = JSON.parse(event.toString()); //TODO
    // event = { eventCode: EventCode, data: data, JWT: JWT};
    console.log("event", event);
    switch (event.eventCode) {
      case EVENTCODES.MESSAGE:
        onMessageHandler(event.data, wss, ws);
        break;
      case EVENTCODES.TYPING:
        onTypingHandler(wss, ws);
        break;
      default:
        ws.send(JSON.stringify({ error: "eventCode don't match" }));
    }
  } catch (e) {
    ws.send(JSON.stringify({ error: e }));
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
      console.log(ws.username);
    })
    .catch((error) => {
      ws.close();
    });
}

module.exports = { eventHandler, connectionHandler };
