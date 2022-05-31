function joinToRoom(roomTitle) {

  const ipt_roomID = document.querySelector("#room-id");

  ipt_roomID.setAttribute("data-room-title", roomTitle);

  namespaceSocket.emit("joinToRoom", {
    roomTitle,
    roomToLeave: ipt_roomID.getAttribute("data-room-title"),
  });

  const div_chat_area = document.querySelector(".chat-area");
  div_chat_area.innerHTML = "";


  namespaceSocket.on("getHistoryofRoom", (data) => {
    div_chat_area.innerHTML = "";

    const spn_room_name = document.querySelector(".room-name");
    spn_room_name.innerHTML = roomTitle;

    ipt_roomID.value = data.roomID;

    if (data.history.length === 0) {
      div_chat_area.innerHTML = `<div class="no-message">There is no message...</div>`;
      return;
    }
    data.history.forEach((message) => {
      div_chat_area.innerHTML += `<div class="message-item ${
        message.userID === currentUserID && "users-message"
      }"><span class="username">${
        message.username
      }</span><span class="message">${message.message}</span></div>`;
    });
  });
}
