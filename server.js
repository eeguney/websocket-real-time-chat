const express = require("express");
const socketio = require("socket.io");
const namespaces = require("./data/setInitialization.js");

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(9000);

const IO = socketio(server);

IO.on("connection", (socket) => {
  const namespaceData = namespaces.map((ns) => {
    return {
      title: ns.title,
      img: ns.img,
      icon: ns.icon,
      endpoint: ns.endpoint,
    };
  });
  socket.emit("namespaceList", namespaceData);
});

namespaces.forEach((namespace) => {
  IO.of(namespace.endpoint).on("connection", (namespaceSocket) => {
    const thisUsername = namespaceSocket.handshake.query.username;

    namespaceSocket.emit("LoadRoom", {namespaceRooms: namespace.rooms, namespaceTitle: namespace.title});

    namespaceSocket.on("joinToRoom", (data) => {
      namespaceSocket.leave(data.roomToLeave);
      namespaceSocket.join(data.roomTitle);
      const thisRoom = namespace.rooms.find(
        (room) => room.title === data.roomTitle
      );
      namespaceSocket.emit("getHistoryofRoom", {
        history: thisRoom.history,
        roomID: thisRoom.id,
      });
    });

    namespaceSocket.on("messageToServer", (data) => {
      const messageInfo = {
        message: data.message,
        time: new Date(),
        username: thisUsername,
        userID: data.userID,
      };

      const currentRoom = namespace.rooms.find(
        (room) => (room.id == data.roomID)
      );

      currentRoom.newMessage(messageInfo);


      IO.of(namespace.endpoint)
        .to(currentRoom.title)
        .emit("messageToClient", messageInfo);
    });
  });
});
