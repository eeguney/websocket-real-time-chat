function joinToNamespace(endpoint) {
  if (namespaceSocket) {
    namespaceSocket.close();
  }
  namespaceSocket = io(`http://192.168.1.7:9000${endpoint}`, {
    query: {
      username,
    },
  });
  namespaceSocket.on("LoadRoom", (data) => {
    const div_list_of_room = document.querySelector(".list-of-room");
    div_list_of_room.innerHTML = "";

    data.namespaceRooms.forEach((room) => {
      div_list_of_room.innerHTML += `<li class="room-item" data-title="${room.title}"><span class="room-item-title">${room.title}</span><span class="online-users">${room.users.length} Users</span></li>`;
    });
    const btn_room_item = document.getElementsByClassName("room-item");
    Array.from(btn_room_item).forEach((element) => {
      element.addEventListener("click", (e) => {
        joinToRoom(element.dataset.title);
        div_room_list.classList.remove("transform-active");
      });
    });
    const firstRoom = document.querySelector(".room-item-title");
    joinToRoom(firstRoom.innerHTML);

    const spn_channel_name = document.querySelector(".channel-name-of-room");
    spn_channel_name.innerHTML = data.namespaceTitle;

    const spn_list_room_name = document.querySelector(".list-room-name");
    spn_list_room_name.innerHTML = data.namespaceTitle;
  });

  namespaceSocket.on("messageToClient", (message) => {
    if (document.querySelector(".no-message")) {
      document.querySelector(".no-message").remove();
    }
    document.querySelector(
      ".chat-area"
    ).innerHTML += `<div class="message-item ${
      message.userID === currentUserID && "users-message"
    }"><span class="username">${message.username}</span><span class="message">${
      message.message
    }</span></div>`;

    window.scrollTo(0, document.querySelector(".chat-area").offsetHeight);
  });

  namespaceSocket.on("imageToClient", (message) => {
    if (document.querySelector(".no-message")) {
      document.querySelector(".no-message").remove();
    }
    document.querySelector(
      ".chat-area"
    ).innerHTML += `<div class="message-item ${
      message.userID === currentUserID && "users-message"
    }"><span class="username">${
      message.username
    }</span><span class="message-image"><img src="${
      message.image
    }" height="200" /></span></div>`;

    window.scrollTo(0, document.querySelector(".chat-area").offsetHeight);
  });

  document.getElementById("send-image").addEventListener("change", (event) => {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
      namespaceSocket.emit("imageToServer", {
        image: reader.result,
        roomID: ipt_roomID,
        userID: currentUserID,
      });
    };
    reader.readAsDataURL(file);
    div_hidden_image_select.classList.toggle("translate-y-0");
  });

  document
    .getElementById("message-form")
    .addEventListener("submit", sendNewMessage);

  function sendNewMessage(event) {
    event.preventDefault();
    let newMessageText = document.getElementById("ipt-message");
    if (newMessageText.value.length > 0)
      namespaceSocket.emit("messageToServer", {
        message: newMessageText.value,
        roomID: ipt_roomID,
        userID: currentUserID,
      });
    newMessageText.value = "";
  }
}
