const express = require("express");
const socketio = require("socket.io");
const namespaces = require("./data/setInitialization.js");

const app = express();

app.use(express.static(__dirname + "/public"));

const server = app.listen(9000);

const IO = socketio(server);

const namespaceData = namespaces.map((ns) => {
  return {
    title: ns.title,
    img: ns.img,
    icon: ns.icon,
    endpoint: ns.endpoint,
    rooms: ns.rooms,
  };
});
IO.on("connection", (socket) => {
  socket.emit("namespaceList", namespaceData);
});

IO.on("disconnect", (userID) => {
  namespaces.forEach((namespace) => namespace.leaveAll(userID));
});

namespaces.forEach((namespace) => {
  IO.of(namespace.endpoint).on("connection", (namespaceSocket) => {
    const thisUsername = namespaceSocket.handshake.query.username;

    namespaceSocket.emit("LoadRoom", {
      namespaceRooms: namespace.rooms,
      namespaceTitle: namespace.title,
    });

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

      const leaveExistNewRoom = namespace.rooms.filter(
        (room) => room.title !== data.roomToLeave
      );
      leaveExistNewRoom.forEach((room) => {
        room.userLeave(data.userID);
      });

      if (!thisRoom.users.some((user) => user.userID == data.userID)) {
        thisRoom.newUser({ username: thisUsername, userID: data.userID });
      }

      setInterval(() => {
        namespaceSocket.emit("getUserList", thisRoom.users);
      }, 2000);
    });

    namespaceSocket.on("messageToServer", (data) => {
      const messageInfo = {
        message: data.message,
        time: new Date(),
        username: thisUsername,
        userID: data.userID,
      };

      const currentRoom = namespace.rooms.find(
        (room) => room.id == data.roomID
      );

      currentRoom.newMessage(messageInfo);

      IO.of(namespace.endpoint)
        .to(currentRoom.title)
        .emit("messageToClient", messageInfo);
    });

    namespaceSocket.on("imageToServer", (data) => {
      const imageInfo = {
        image: data.image,
        time: new Date(),
        username: thisUsername,
        userID: data.userID,
      };

      const currentRoom = namespace.rooms.find(
        (room) => room.id == data.roomID
      );

      currentRoom.newMessage(imageInfo);

      IO.of(namespace.endpoint)
        .to(currentRoom.title)
        .emit("imageToClient", imageInfo);
    });

    namespaceSocket.on("refreshNamespaceList", () => {
      IO.emit("namespaceList", namespaceData);
    });
  });
});
